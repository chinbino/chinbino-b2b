import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Supplier } from '../entities/supplier.entity';
import { Product } from './product.entity';

@Controller('suppliers/products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('supplier')
  create(@Body() data: Partial<Product>, @Param('supplier') supplier: Supplier): Promise<Product> {
    return this.productsService.create(supplier, data);
  }

  @Get()
  @Roles('supplier')
  findAll(@Param('supplier') supplier: Supplier): Promise<Product[]> {
    return this.productsService.findAll(supplier);
  }

  @Get(':id')
  @Roles('supplier')
  findOne(@Param('id') id: string, @Param('supplier') supplier: Supplier): Promise<Product> {
    return this.productsService.findOne(id, supplier);
  }

  @Patch(':id')
  @Roles('supplier')
  update(@Param('id') id: string, @Param('supplier') supplier: Supplier, @Body() data: Partial<Product>): Promise<Product> {
    return this.productsService.update(id, supplier, data);
  }

  @Delete(':id')
  @Roles('supplier')
  remove(@Param('id') id: string, @Param('supplier') supplier: Supplier): Promise<void> {
    return this.productsService.remove(id, supplier);
  }
}
