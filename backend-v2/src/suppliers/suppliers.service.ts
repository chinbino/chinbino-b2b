// src/suppliers/suppliers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    // بررسی تکراری نبودن businessEmail
    const existing = await this.suppliersRepository.findOne({
      where: { businessEmail: createSupplierDto.businessEmail }
    });

    if (existing) {
      throw new BadRequestException('این ایمیل کسب‌وکار قبلاً ثبت شده است');
    }

    const supplier = this.suppliersRepository.create(createSupplierDto);
    return await this.suppliersRepository.save(supplier);
  }

  async findAll(verifiedOnly?: boolean): Promise<Supplier[]> {
    const where: any = { isActive: true };
    
    // اگر verifiedOnly برابر true باشد، فقط verifiedها را بیاور
    if (verifiedOnly !== undefined && verifiedOnly === true) {
      where.verificationStatus = 'verified';
    }
    
    return await this.suppliersRepository.find({
      where,
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('تامین‌کننده یافت نشد');
    }
    return supplier;
  }

  async findByUserId(userId: string): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({ 
      where: { userId } 
    });
    if (!supplier) {
      throw new NotFoundException('تامین‌کننده برای این کاربر یافت نشد');
    }
    return supplier;
  }

  async update(id: string, updateData: Partial<Supplier>): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateData);
    return await this.suppliersRepository.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const result = await this.suppliersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('تامین‌کننده یافت نشد');
    }
  }
}
