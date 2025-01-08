import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() orderData: any) {
    return this.ordersService.update(id, orderData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.ordersService.delete(id);
  }

  @Post()
  async createOrder(@Body() orderData: CreateOrderDto) {
    return this.ordersService.createOrder(orderData);
  }
}
