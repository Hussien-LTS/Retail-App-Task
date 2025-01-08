import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeOptionsFactory,
  SequelizeModuleOptions,
} from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Order } from 'src/orders/order.model';

@Injectable()
export class DatabaseConfig implements SequelizeOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createSequelizeOptions(): Promise<SequelizeModuleOptions> {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: this.configService.get('DATABASE_HOST'),
      port: +this.configService.get('DATABASE_PORT') || 5432,
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: 'postgres',
    });

    const targetDatabase = this.configService.get('DATABASE_NAME');

    const [result] = await sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${targetDatabase}'`,
    );

    if (!result.length) {
      await sequelize.query(`CREATE DATABASE "${targetDatabase}"`);
      console.log(`Database "${targetDatabase}" created successfully!`);
    }

    await sequelize.close();

    return {
      dialect: 'postgres',
      host: this.configService.get('DATABASE_HOST'),
      port: +this.configService.get('DATABASE_PORT') || 5432,
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: targetDatabase,
      models: [Order],
      synchronize: true,
      autoLoadModels: true,
      logging: false,
    };
  }
}
