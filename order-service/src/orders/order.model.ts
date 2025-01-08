import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Order extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  totalPrice: number;
}
