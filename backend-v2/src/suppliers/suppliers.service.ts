// src/suppliers/suppliers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    // بررسی وجود کاربر
    const user = await this.usersRepository.findOne({
      where: { id: createSupplierDto.userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // بررسی تکراری نبودن businessEmail
    const existingSupplier = await this.suppliersRepository.findOne({
      where: { businessEmail: createSupplierDto.businessEmail }
    });

    if (existingSupplier) {
      throw new BadRequestException('Business email already registered');
    }

    // ایجاد Supplier
    const supplier = this.suppliersRepository.create({
      ...createSupplierDto,
      user: user
    });

    return await this.suppliersRepository.save(supplier);
  }

  async findAll(verifiedOnly: boolean = true): Promise<Supplier[]> {
    const where: any = {};
    
    if (verifiedOnly) {
      where.verificationStatus = 'verified';
      where.isActive = true;
    }

    return await this.suppliersRepository.find({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({
      where: { id },
      relations: ['user', 'products']
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async findByUserId(userId: string): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({
      where: { userId },
      relations: ['user']
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier for user ${userId} not found`);
    }

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);

    // اگر verificationStatus به verified تغییر کرد
    if (updateSupplierDto.verificationStatus === 'verified' && 
        supplier.verificationStatus !== 'verified') {
      updateSupplierDto['verifiedAt'] = new Date();
    }

    Object.assign(supplier, updateSupplierDto);
    return await this.suppliersRepository.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const result = await this.suppliersRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
  }

  async updateRating(supplierId: string, newRating: number): Promise<Supplier> {
    const supplier = await this.findOne(supplierId);
    
    // محاسبه rating جدید
    const totalScore = (supplier.rating * supplier.totalReviews) + newRating;
    supplier.totalReviews += 1;
    supplier.rating = totalScore / supplier.totalReviews;

    return await this.suppliersRepository.save(supplier);
  }
}
