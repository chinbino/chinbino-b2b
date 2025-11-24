import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, seller: User): Promise<Product> {
    const product = this.productsRepository.create({
      ...createProductDto,
      seller: seller,
      status: 'active',
    });

    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { status: 'active' },
      relations: ['seller'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, status: 'active' },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    return product;
  }

  async update(id: string, updateData: UpdateProductDto, seller: User): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    if (product.seller.id !== seller.id) {
      throw new ForbiddenException('شما مجوز ویرایش این محصول را ندارید');
    }

    await this.productsRepository.update(id, updateData);
    return await this.productsRepository.findOne({ where: { id } });
  }

  async remove(id: string, seller: User): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    if (product.seller.id !== seller.id) {
      throw new ForbiddenException('شما مجوز حذف این محصول را ندارید');
    }

    await this.productsRepository.update(id, { status: 'inactive' });
  }

  async findBySeller(sellerId: string): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { 
        seller: { id: sellerId },
        status: 'active'
      },
      order: { createdAt: 'DESC' },
    });
  }
}
