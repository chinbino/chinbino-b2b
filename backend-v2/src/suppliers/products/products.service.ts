import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './product.entity';
import { Supplier } from '../supplier.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(supplier: Supplier, data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create({
      ...data,
      supplier,
    });
    return this.productRepository.save(product);
  }

  async findAll(supplier?: Supplier): Promise<Product[]> {
    if (supplier) {
      return this.productRepository.find({ where: { supplier } });
    }
    return this.productRepository.find();
  }

  async findOne(id: string, supplier?: Supplier): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (supplier && product.supplier.id !== supplier.id) {
      throw new ForbiddenException('Access denied');
    }
    return product;
  }

  async update(id: string, supplier: Supplier, data: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id, supplier);
    Object.assign(product, data);
    return this.productRepository.save(product);
  }

  async remove(id: string, supplier: Supplier): Promise<void> {
    const product = await this.findOne(id, supplier);
    product.status = ProductStatus.INACTIVE;
    await this.productRepository.save(product);
  }
}
