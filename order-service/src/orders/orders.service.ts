import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { Order } from './order.model';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderModel.findAll();
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderModel.findByPk(id);
  }

  async update(id: number, orderData: UpdateOrderDto): Promise<[number]> {
    const existingOrder = await this.orderModel.findByPk(id);
    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    const productServiceUrl = this.configService.get<string>(
      'PRODUCT_SERVICE_URL',
    );
    const productUrl = `${productServiceUrl}/products/${existingOrder.productId}`;
    let product;
    try {
      const response = await axios.get(productUrl);
      product = response.data;
    } catch (error) {
      throw new NotFoundException({
        message: 'Product service is unavailable or product not found',
        error: error.message,
      });
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (orderData.quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive number');
    }

    const quantityDifference = orderData.quantity - existingOrder.quantity;
    if (quantityDifference >= 0) {
      if (product.quantity < quantityDifference) {
        throw new NotFoundException(
          `Insufficient quantity: Only ${product.quantity} left in stock`,
        );
      }

      const updateQuantityUrl = `${productServiceUrl}/products/${existingOrder.productId}`;
      try {
        await axios.put(updateQuantityUrl, {
          quantity: product.quantity - quantityDifference,
        });
      } catch (error) {
        throw new Error(`Failed to update product quantity: ${error.message}`);
      }
    } else if (quantityDifference < 0) {
      const updateQuantityUrl = `${productServiceUrl}/products/${existingOrder.productId}`;
      try {
        await axios.put(updateQuantityUrl, {
          quantity: product.quantity + Math.abs(quantityDifference),
        });
      } catch (error) {
        throw new Error(`Failed to update product quantity : ${error.message}`);
      }
    }

    const updatedOrder = await this.orderModel.update(orderData, {
      where: { id },
    });
    return updatedOrder;
  }

  async delete(id: number): Promise<{ deleted: boolean; message: string }> {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      return {
        deleted: false,
        message: `Order with ID ${id} not found.`,
      };
    }

    const productServiceUrl = this.configService.get<string>(
      'PRODUCT_SERVICE_URL',
    );
    const productUrl = `${productServiceUrl}/products/${order.productId}`;

    try {
      await axios.put(productUrl, {
        quantity: order.quantity,
      });
    } catch (error) {
      throw new Error(`Failed to update product quantity: ${error.message}`);
    }

    const deletedCount = await this.orderModel.destroy({ where: { id } });

    if (deletedCount === 0) {
      return {
        deleted: false,
        message: `Order with ID ${id} could not be deleted.`,
      };
    }

    return {
      deleted: true,
      message: `Order with ID ${id} successfully deleted. Product quantity updated.`,
    };
  }

  async createOrder(orderData: CreateOrderDto) {
    const productServiceUrl = this.configService.get<string>(
      'PRODUCT_SERVICE_URL',
    );
    const productUrl = `${productServiceUrl}/products/${orderData.productId}`;
    const updateProductUrl = `${productServiceUrl}/products/${orderData.productId}`;

    let product;

    try {
      const response = await axios.get(productUrl);
      product = response.data;
    } catch (error) {
      throw new NotFoundException({
        message: 'Product service is unavailable or product not found',
        error: error.message,
      });
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.quantity < orderData.quantity) {
      throw new BadRequestException('Insufficient product quantity');
    }

    const totalPrice = product.price * orderData.quantity;

    try {
      await axios.put(updateProductUrl, {
        quantity: product.quantity - orderData.quantity,
      });
    } catch (error) {
      throw new BadRequestException({
        message: 'Failed to update product quantity',
        error: error.message,
      });
    }

    const order = await this.orderModel.create({
      productId: orderData.productId,
      quantity: orderData.quantity,
      totalPrice,
    });

    return order;
  }
}
