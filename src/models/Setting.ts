import { Model, Table, Column, PrimaryKey, AllowNull, DataType, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Checkout } from './Checkout';
import { PaidStatus } from '../types/paidStatus.type';

@Table({
  tableName: 'settings',
  name: {
    singular: 'setting',
    plural: 'settings'
  }
})
export class Setting extends Model<Setting> {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  enabled!: boolean

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;

  //#endregion
}
