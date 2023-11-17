import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  DataType,
  Default,
} from "sequelize-typescript";
import { UserStatus } from "../types/userStatus.type";
import { TosStatus } from "../types/tosStatus.type";
import { Col } from "sequelize/types/utils";

@Table({
  tableName: "kycLinks",
  name: {
    singular: "kycLink",
    plural: "kycLinks",
  },
})
export class KycLink extends Model<KycLink> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(null)
  @Default("user")
  @Column(DataType.STRING(50))
  associatedObjectType!: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  userId!: string;

  @AllowNull(null)
  @Default("user")
  @Column(DataType.STRING(50))
  associatedUserType!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.UUID)
  customerId!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  email!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.ENUM("individual", "business"))
  type!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  kycLink!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.TEXT)
  tosLink!: string;

  @AllowNull(false)
  @Default(UserStatus.Pending)
  @Column(DataType.ENUM(...Object.values(UserStatus)))
  kycStatus!: UserStatus;

  @AllowNull(false)
  @Default(TosStatus.Pending)
  @Column(DataType.ENUM(...Object.values(TosStatus)))
  tosStatus!: TosStatus;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;
}
