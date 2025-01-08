import { IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
export class UpdateOrderDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
