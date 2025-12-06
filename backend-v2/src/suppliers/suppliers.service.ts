// src/suppliers/suppliers.service.ts - نسخه ساده برای تست
import { Injectable } from '@nestjs/common';
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
    console.log('Creating supplier with data:', createSupplierDto);
    
    const supplier = this.suppliersRepository.create(createSupplierDto);
    const saved = await this.suppliersRepository.save(supplier);
    
    console.log('Supplier saved:', saved);
    return saved;
  }

  async findAll(): Promise<Supplier[]> {
    return await this.suppliersRepository.find();
  }
}
