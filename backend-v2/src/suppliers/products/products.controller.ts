import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Supplier } from '../supplier.entity';
import { Product } from './product.entity';

@Controller('suppliers/products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@CurrentUser() supplier: Supplier, @Body() data: Partial<Product>): Promise<Product> {
    return this.productsService.create(supplier, data);
  }

  @Get()
  findAll(@CurrentUser() supplier: Supplier): Promise<Product[]> {
    return this.productsService.findAll(supplier);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() supplier: Supplier): Promise<Product> {
    return this.productsService.findOne(id, supplier);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() supplier: Supplier, @Body() data: Partial<Product>): Promise<Product> {
    return this.productsService.update(id, supplier, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() supplier: Supplier): Promise<void> {
    return this.productsService.remove(id, supplier);
  }
}

