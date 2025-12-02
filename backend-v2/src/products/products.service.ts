import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, sellerId: number) { // تغییر: string → number
    const product = this.productsRepository.create({
      ...createProductDto,
      seller: { id: sellerId }, // sellerId اکنون number است
      status: ProductStatus.ACTIVE,
    });

    return await this.productsRepository.save(product);
  }

  async findAll() {
    return await this.productsRepository.find({
      where: { status: ProductStatus.ACTIVE },
      relations: ['seller'],
    });
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id, status: ProductStatus.ACTIVE },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    
    const updated = await this.productsRepository.preload({
      id: product.id,
      ...updateProductDto,
    });

    if (!updated) {
      throw new NotFoundException('Product not found');
    }

    return await this.productsRepository.save(updated);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    
    await this.productsRepository.update(id, { 
      status: ProductStatus.INACTIVE 
    });

    return { message: 'Product deleted successfully' };
  }

  async findSellerProducts(sellerId: number) { // تغییر: string → number
    return await this.productsRepository.find({
      where: { 
        seller: { id: sellerId }, // sellerId اکنون number است
        status: ProductStatus.ACTIVE 
      },
      relations: ['seller'],
    });
  }
}
