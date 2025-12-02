import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller, SellerStatus } from './entities/seller.entity';
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

    const seller = this.sellersRepository.create({
      ...createSellerDto,
      status: SellerStatus.PENDING, // وضعیت پیش‌فرض
    });

    return await this.sellersRepository.save(seller);
  }

  async findAll(includeDeleted: boolean = false): Promise<Seller[]> {
    const query = this.sellersRepository.createQueryBuilder('seller')
      .leftJoinAndSelect('seller.users', 'users')
      .leftJoinAndSelect('seller.products', 'products')
      .orderBy('seller.id', 'ASC');

    if (!includeDeleted) {
      query.andWhere('seller.deleted_at IS NULL');
    }

    return await query.getMany();
  }

  async findOne(id: number, includeDeleted: boolean = false): Promise<Seller> {
    const query = this.sellersRepository.createQueryBuilder('seller')
      .leftJoinAndSelect('seller.users', 'users')
      .leftJoinAndSelect('seller.products', 'products')
      .where('seller.id = :id', { id });

    if (!includeDeleted) {
      query.andWhere('seller.deleted_at IS NULL');
    }

    const seller = await query.getOne();

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto): Promise<Seller> {
    const seller = await this.findOne(id);
    
    // بررسی وضعیت برای تغییر
    if (updateSellerDto.status && updateSellerDto.status !== seller.status) {
      // می‌توانید منطق validation برای تغییر status اینجا اضافه کنید
    }
    
    Object.assign(seller, updateSellerDto);
    
    return await this.sellersRepository.save(seller);
  }

  async remove(id: number): Promise<{ message: string }> {
    const seller = await this.findOne(id);
    
    // Soft Delete: فقط deleted_at را set می‌کنیم
    await this.sellersRepository.softDelete(id);
    
    return { message: 'Seller soft deleted successfully' };
  }

  async restore(id: number): Promise<Seller> {
    const seller = await this.sellersRepository.findOne({
      where: { id },
      withDeleted: true // شامل deleted items
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found (even in deleted)`);
    }

    if (!seller.deletedAt) {
      throw new BadRequestException('Seller is not deleted');
    }

    await this.sellersRepository.restore(id);
    
    // وضعیت را به pending برمی‌گردانیم
    seller.status = SellerStatus.PENDING;
    seller.deletedAt = null;
    
    return await this.sellersRepository.save(seller);
  }

  async permanentDelete(id: number): Promise<{ message: string }> {
    const seller = await this.sellersRepository.findOne({
      where: { id },
      withDeleted: true
    });

    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

    // Hard Delete: حذف کامل از دیتابیس
    await this.sellersRepository.remove(seller);
    
    return { message: 'Seller permanently deleted' };
  }

  async getSellerStats(id: number) {
    const seller = await this.findOne(id);
    
    return {
      id: seller.id,
      nameZh: seller.nameZh,
      status: seller.status,
      totalUsers: seller.users?.length || 0,
      totalProducts: seller.products?.length || 0,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
      deletedAt: seller.deletedAt
    };
  }

  // متد کمکی برای تست
  async getDeletedSellers(): Promise<Seller[]> {
    return await this.sellersRepository.find({
      where: { deletedAt: { $not: null } as any },
      withDeleted: true
    });
  }
}
