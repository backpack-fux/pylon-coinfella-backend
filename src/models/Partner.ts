import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  DataType,
  Default,
  IsEmail,
  BeforeUpdate,
  BeforeCreate,
} from "sequelize-typescript";
import { UserService } from "../services/userService";
import { UserStatus } from "../types/userStatus.type";
import axios from "axios";
import { log } from "../utils";
import { TipType } from "../types/tip.type";
import { FeeMethod } from "../types/feeMethod.enum";

@Table({
  tableName: "partners",
  name: {
    singular: "partner",
    plural: "partners",
  },
})
export class Partner extends Model<Partner> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Default(UserStatus.Pending)
  @Column(DataType.ENUM(...Object.values(UserStatus)))
  status!: UserStatus;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  companyName!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  displayName!: string;

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

  @AllowNull(true)
  @Column(DataType.TEXT)
  password: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  phoneNumber!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  ssn!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(50))
  dob!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  streetAddress!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  streetAddress2!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  city!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(25))
  state!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(10))
  postalCode!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  country!: string;

  @AllowNull(false)
  @Default(6.5)
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

  @AllowNull(true)
  @Default(null)
  @Column(DataType.TEXT)
  webhook!: string;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  //#region Associations
  get isApproved() {
    return this.status === UserStatus.Active;
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  //#endregion

  @BeforeUpdate
  @BeforeCreate
  static async beforeSaveHook(partner: Partner, options: any) {
    if (partner.password && partner.changed("password")) {
      const hashedPw = await UserService.encryptPassword(partner.password);
      partner.password = hashedPw as string;
    }
  }

  static async findPartner(email: string, password: string) {
    const partner = await this.findOne({
      where: { email },
    });

    if (!partner || partner.password == null || partner.password.length === 0) {
      throw new Error("Invalid email or password");
    }

    const isPasswordMatch = await UserService.comparePassword(
      password,
      partner.password
    );

    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
    }

    return partner;
  }

  async sendWebhook(
    id: string,
    type: "order" | "account" | "user",
    action: "create" | "update",
    data: OrderPayload | AccountPayload
  ) {
    console.log("send webhook ===============================");
    console.log({
      id,
      type,
      action,
      accountId: this.id,
      data,
    });
    if (!this?.webhook) {
      return;
    }

    try {
      await axios.post(this.webhook, {
        id,
        type,
        action,
        accountId: this.id,
        data,
      });
    } catch (err) {
      log.warn(
        {
          func: "partner.sendWebhook",
          accountId: this.id,
          data,
          id,
          type,
          err,
        },
        "Failed send webhook"
      );
    }
  }
}

interface AccountPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status?: string;
  ssn?: string;
  dob?: string;
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

export interface OrderPayload {
  id: string;
  walletAddress: string;
  email: string;
  phoneNumber: string;
  status: string;
  partnerOrderId?: string;
  transactionHash?: string;
  feeAmount: number;
  tipAmount: number;
  chargeAmount: number;
  unitAmount?: number;
  chargeStatus?: string;
  chargeId?: string;
  chargeCode?: string;
  chargeMsg?: string;
  last4?: string;
  customer?: AccountPayload;
}
