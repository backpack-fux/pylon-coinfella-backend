import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AllowNull,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'agreementLinks',
  name: {
    singular: 'agreementLink',
    plural: 'agreementLinks'
  }
})

export class AgreementLink extends Model<AgreementLink> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  link!: string;

  @Column(DataType.DATE)
  createdAt!: Date;

  @Column(DataType.DATE)
  updatedAt!: Date;
}
