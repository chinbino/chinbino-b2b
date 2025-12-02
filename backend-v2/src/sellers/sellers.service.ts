import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellersRepository: Repository<Seller>,
  ) {}

  async create(createSellerDto: CreateSellerDto): Promise<Seller> {
    // بررسی تکراری نبودن نام چینی
    const existing = await this.sellersRepository.findOne({
      where: { nameZh: createSellerDto.nameZh }
    });

    if (existing) {
      throw new ConflictException('Seller with this Chinese name already exists');
    }

    const seller = this.sellersRepository.create(createSellerDto);
    return await this.sellersRepository.save(seller);
  }

  async findAll(): Promise<Seller[]> {
    return await this.sellersRepository.find({
      relations: ['users', 'products'],
      order: { id: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Seller> {
    const seller = await this.sellersRepository.findOne({
      where: { id },
      relations: ['users', 'products']
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto): Promise<Seller> {
    const seller = await this.findOne(id);
    
    Object.assign(seller, updateSellerDto);
    
    return await this.sellersRepository.save(seller);
  }

  async remove(id: number): Promise<void> {
    const seller = await this.findOne(id);
    
    // بررسی اینکه فروشنده محصول یا کاربری ندارد
    if (seller.products && seller.products.length > 0) {
      throw new ConflictException('Cannot delete seller with existing products');
    }

    if (seller.users && seller.users.length > 0) {
      throw new ConflictException('Cannot delete seller with associated users');
    }

    await this.sellersRepository.remove(seller);
  }

  async getSellerStats(id: number) {
    const seller = await this.findOne(id);
    
    return {
      id: seller.id,
      nameZh: seller.nameZh,
      totalUsers: seller.users?.length || 0,
      totalProducts: seller.products?.length || 0,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt
    };
  }
}
