import { Model, Table, Column, PrimaryKey, AllowNull, DataType, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Checkout } from './Checkout';
import { PaidStatus } from '../types/paidStatus.type';

@Table({
  tableName: 'assetTransfers',
  name: {
    singular: 'assetTransfer',
    plural: 'assetTransfers'
  }
})
export class AssetTransfer extends Model<AssetTransfer> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Checkout)
  @AllowNull(false)
  @Column(DataType.UUID)
  checkoutId!: string;

  @AllowNull(false)
  @Default(PaidStatus.Pending)
  @Column(DataType.ENUM(...Object.values(PaidStatus)))
  status!: PaidStatus;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 6))
  amount!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(10, 6))
  rate!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 6))
  fee!: number;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(255))
  transactionHash!: string

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  settledAt!: Date

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATE)
  cancelledAt!: Date

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
