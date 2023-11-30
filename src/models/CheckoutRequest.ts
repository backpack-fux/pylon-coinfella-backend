import axios from "axios";
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  DataType,
  Default,
  IsEmail,
  HasOne,
  ForeignKey,
  BelongsTo,
  Scopes,
  HasMany,
} from "sequelize-typescript";
import { PaidStatus } from "../types/paidStatus.type";
import { log } from "../utils";
import shortUUID from "short-uuid";

import { Checkout } from "./Checkout";
import { Partner } from "./Partner";
import { TipType } from "../types/tip.type";
import { FeeMethod } from "../types/feeMethod.enum";
import { Charge } from "./Charge";
import { AssetTransfer } from "./AssetTransfer";
import { User } from "./User";

@Table({
  tableName: "checkoutRequests",
  name: {
    singular: "checkoutRequest",
    plural: "checkoutRequests",
  },
})
@Scopes(() => ({
  checkout: {
    include: [
      {
        model: Checkout,
        limit: 1,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Charge,
          },
          {
            model: AssetTransfer,
          },
          {
            model: User,
          },
        ],
      },
    ],
  },
}))
export class CheckoutRequest extends Model<CheckoutRequest> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.STRING(100))
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(true)
  @Column(DataType.UUID)
  @ForeignKey(() => Partner)
  partnerId!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  partnerOrderId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  walletAddress!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  firstName!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  lastName!: string;

  @AllowNull(true)
  @IsEmail
  @Default(null)
  @Column(DataType.STRING(100))
  email!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  phoneNumber!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  streetAddress!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  streetAddress2!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  city!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(25))
  state!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(10))
  postalCode!: string;

  @AllowNull(false)
  @Default("USA")
  @Column(DataType.STRING(255))
  country!: string;

  @AllowNull(false)
  @Default("USD")
  @Column(DataType.STRING(3))
  currency!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  amount!: number;

  @AllowNull(false)
  @Default("pending")
  @Column(DataType.ENUM("pending", "processing", "paid", "postponed", "error"))
  status!: PaidStatus;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  transactionHash!: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  fee!: number;

  @AllowNull(false)
  @Default("percent")
  @Column(DataType.ENUM("cash", "percent"))
  feeType!: TipType;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER.UNSIGNED)
  feeMethod!: FeeMethod;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  @HasMany(() => Checkout)
  checkouts!: Checkout[];

  @BelongsTo(() => Partner)
  partner!: Partner;
  getPartner!: () => Promise<Partner>;

  get checkout() {
    if (this.checkouts?.length) {
      return this.checkouts[0];
    }

    return undefined;
  }

  static async generateCheckoutRequest(data: Partial<CheckoutRequest>) {
    return CheckoutRequest.create({
      ...data,
      id: shortUUID.generate(),
    });
  }
}
