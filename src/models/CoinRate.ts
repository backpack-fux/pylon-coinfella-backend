import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  DataType,
  Default,
} from "sequelize-typescript";
@Table({
  tableName: "coinRates",
  name: {
    singular: "coinRate",
    plural: "coinRates",
  },
})
export class CoinRate extends Model<CoinRate> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING(10))
  id!: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(10, 6))
  rate!: number;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;
}
