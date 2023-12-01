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
  ForeignKey,
  BelongsTo,
  AfterSave,
  AfterUpdate,
} from "sequelize-typescript";
import { UserService } from "../services/userService";
import { UserStatus } from "../types/userStatus.type";
import { Partner } from "./Partner";

@Table({
  tableName: "users",
  name: {
    singular: "user",
    plural: "users",
  },
})
export class User extends Model<User> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  externalUserId!: string;

  @AllowNull(true)
  @Column(DataType.UUID)
  @ForeignKey(() => Partner)
  partnerId!: string;

  @AllowNull(false)
  @Default(UserStatus.Pending)
  @Column(DataType.ENUM(...Object.values(UserStatus)))
  status!: UserStatus;

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
  @Column(DataType.TEXT)
  password: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  phoneNumber!: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  gender!: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  dob!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  ssn!: string;

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

  @AllowNull(false)
  @Column(DataType.STRING(255))
  country!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.JSON)
  requirementsDue!: string[];

  @AllowNull(true)
  @Default(null)
  @Column(DataType.JSON)
  futureRequirementsDue!: string[];

  @AllowNull(false)
  @Column(DataType.STRING)
  signedAgreementId!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  idempotenceId!: string;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  //#region Associations
  @BelongsTo(() => Partner)
  partner!: Partner;
  getPartner!: () => Promise<Partner>;
  //#endregion

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get isVerified() {
    return this.status === UserStatus.Active;
  }

  get isRejected() {
    return (this.status = UserStatus.Rejected);
  }

  @BeforeUpdate
  @BeforeCreate
  static async beforeSaveHook(user: User, options: any) {
    if (user.password && user.changed("password")) {
      const hashedPw = await UserService.encryptPassword(user.password);
      user.password = hashedPw as string;
    }
  }

  static async findUser(email: string, password: string, cb: Function) {
    try {
      const user = await this.findOne({
        where: { email },
      });

      if (
        user == null ||
        user.password === null ||
        user.password.length === 0
      ) {
        cb(new Error("Invalid email or password"), null);
        return;
      }

      const isPasswordMatch = await UserService.comparePassword(
        password,
        user.password
      );

      if (isPasswordMatch) {
        return cb(null, user);
      }

      cb(new Error("Invalid email or password"), null);
    } catch (err: any) {
      cb(err, null);
    }
  }

  async sendWebhook(action: "create" | "update") {
    const partner = await this.getPartner();

    if (!partner) {
      return;
    }

    return partner.sendWebhook(this.externalUserId, "user", action, {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      ssn: this.ssn,
      dob: this.dob,
      status: this.status,
      streetAddress: this.streetAddress,
      streetAddress2: this.streetAddress2,
      city: this.city,
      postalCode: this.postalCode,
      state: this.state,
      country: this.country,
    });
  }
}
