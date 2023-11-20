import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  DataType,
  Default,
  IsEmail,
  ForeignKey,
  BelongsTo,
  HasOne,
} from "sequelize-typescript";
import { PaidStatus } from "../types/paidStatus.type";
import { TipType } from "../types/tip.type";
import { newDinero } from "../utils/currency";
import { CheckoutRequest } from "./CheckoutRequest";
import { User } from "./User";
import { Charge } from "./Charge";
import { AssetTransfer } from "./AssetTransfer";
import { emailService } from "../email";
import * as moment from "moment-timezone";
import { Config } from "../config";
import { FeeMethod } from "../types/feeMethod.enum";

@Table({
  tableName: "checkouts",
  name: {
    singular: "checkout",
    plural: "checkouts",
  },
})
export class Checkout extends Model<Checkout> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => CheckoutRequest)
  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  checkoutRequestId!: string;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Default(null)
  @Column(DataType.UUID)
  userId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  walletAddress!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  firstName!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  lastName!: string;

  @AllowNull(false)
  @IsEmail
  @Column(DataType.STRING(100))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  phoneNumber!: string;

  @AllowNull(false)
  @Default("USD")
  @Column(DataType.STRING(3))
  currency!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  amount!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  tip!: number;

  @AllowNull(false)
  @Default("percent")
  @Column(DataType.ENUM("cash", "percent"))
  tipType!: TipType;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  fee!: number;

  @AllowNull(false)
  @Default("cash")
  @Column(DataType.ENUM("cash", "percent"))
  feeType!: TipType;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER.UNSIGNED)
  feeMethod!: FeeMethod;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  streetAddress!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  streetAddress2!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  city!: string;

  @AllowNull(false)
  @Column(DataType.STRING(25))
  state!: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  postalCode!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  country!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  checkoutTokenId!: string;

  @AllowNull(false)
  @Default("pending")
  @Column(DataType.ENUM("pending", "processing", "paid", "postponed", "error"))
  status!: PaidStatus;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  //#region Associations

  @BelongsTo(() => CheckoutRequest)
  checkoutRequest!: CheckoutRequest;
  getCheckoutRequest!: () => Promise<CheckoutRequest>;
  setCheckoutRequest!: (checkoutRequest: CheckoutRequest) => void;

  @BelongsTo(() => User)
  user!: User;
  getUser!: () => Promise<User>;

  @HasOne(() => Charge)
  charge!: Charge;
  getCharge!: () => Promise<Charge>;

  @HasOne(() => AssetTransfer)
  assetTransfer!: AssetTransfer;
  getAssetTransfer: () => Promise<AssetTransfer>;

  //#endregion

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get zeroMoney() {
    return newDinero(0, this.currency);
  }

  get amountMoney() {
    return newDinero(Number(this.amount) * 100, this.currency);
  }

  get tipAmountMoney() {
    if (!this.tip) {
      return this.zeroMoney;
    }

    if (this.tipType === TipType.Cash) {
      return newDinero(Number(this.tip) * 100, this.currency);
    }

    return this.amountMoney.multiply(Number(this.tip) / 100);
  }

  get fundsAmountMoney() {
    return this.amountMoney.add(this.tipAmountMoney);
  }

  get feeAmountMoney() {
    if (!this.fee) {
      return this.zeroMoney;
    }

    if (this.feeType === TipType.Cash) {
      return newDinero(this.fee * 100, this.currency);
    }

    return this.fundsAmountMoney.multiply(this.fee / 100);
  }

  get totalChargeAmountMoney() {
    if (this.feeMethod === FeeMethod.Card) {
      // Card
      return this.fundsAmountMoney.add(this.feeAmountMoney);
    }

    return this.fundsAmountMoney;
  }

  getUSDCFeeMoney(amount: number) {
    const amountMoney = newDinero(amount * 100, this.currency);

    if (this.feeMethod === FeeMethod.Card) {
      return this.zeroMoney;
    }

    if (this.feeType === TipType.Cash) {
      newDinero(Number(this.fee) * 100, this.currency);
    }

    return amountMoney.multiply(Number(this.fee) / 100);
  }

  getAssetTransferMoney(amount: number) {
    const amountMoney = newDinero(Number(amount * 100), this.currency);

    if (this.feeMethod === FeeMethod.Card) {
      return amountMoney;
    }

    const feeMoney = this.getUSDCFeeMoney(amount);

    return amountMoney.subtract(feeMoney);
  }

  async sendReceipt() {
    if (!this.email) {
      return;
    }

    const assetTransfer = await this.getAssetTransfer();
    const charge = await this.getCharge();
    const checkoutRequest = await this.getCheckoutRequest();
    const partner = checkoutRequest && (await checkoutRequest.getPartner());

    await emailService.sendReceiptEmail(this.email, {
      name: this.fullName,
      transactionHash: `${Config.web3.explorerUri}/tx/${assetTransfer?.transactionHash}`,
      paymentMethod: charge.last4,
      dateTime: moment
        .utc(assetTransfer?.settledAt || new Date())
        .format("MMMM Do YYYY, hh:mm"),
      amount: assetTransfer?.amount || this.fundsAmountMoney.toFormat(),
      fee: this.feeAmountMoney.toUnit(),
      partnerOrderId: checkoutRequest?.partnerOrderId,
      partnerName: partner?.displayName || partner?.companyName,
      orderLink: checkoutRequest?.id
        ? `${Config.frontendUri}/${checkoutRequest.id}`
        : undefined,
    });
  }
}
