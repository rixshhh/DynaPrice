import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductsRepository {
  private readonly products = [new ProductEntity('prd_1', 'sku-1', 'Starter Plan', 49)];

  async findAll(): Promise<ProductEntity[]> {
    return this.products;
  }
}
