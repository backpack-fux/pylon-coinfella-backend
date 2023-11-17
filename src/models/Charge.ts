import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Checkout } from "./Checkout";

@Table({
  tableName: "charges",
  name: {
    singular: "charge",
    plural: "charges",
  },
})
export class Charge extends Model<Charge> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(255))
  id!: string;

  @ForeignKey(() => Checkout)
  @AllowNull(false)
  @Column(DataType.UUID)
  checkoutId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  status!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  amount!: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  currency!: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  approved!: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  flagged!: boolean;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  processedOn!: Date;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  reference!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(4))
  last4!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(10))
  bin!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(50))
  code!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.TEXT)
  message!: string;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  //#region Associations

  @BelongsTo(() => Checkout)
  checkout!: Checkout;
  getCheckout!: () => Promise<Checkout>;
  setCheckout!: (caller: Checkout) => void;

  //#endregion
}
