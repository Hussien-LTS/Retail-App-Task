import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return await this.productModel.create(createProductDto as any);
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.findAll();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    await product.update(updateProductDto);

    return product;
  }

  async delete(id: number): Promise<{ deleted: boolean; message: string }> {
    await this.findOne(id);

    const deletedCount = await this.productModel.destroy({ where: { id } });

    if (deletedCount === 0) {
      return {
        deleted: false,
        message: `Product with ID ${id} could not be deleted`,
      };
    }

    return {
      deleted: true,
      message: `Product with ID ${id} successfully deleted`,
    };
  }
}
