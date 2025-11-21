import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SellerGuard } from '../auth/guards/seller.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ایجاد محصول جدید (فروشنده چینی)
  @Post()
  @UseGuards(JwtAuthGuard, SellerGuard)
  create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    return this.productsService.create(createProductDto, req.user.id);
  }

  // دریافت همه محصولات برای مشتری (چندزبانه)
  @Get()
  findAllForCustomer(@Query('lang') language: string) {
    return this.productsService.findAllForCustomer(language || 'fa');
  }

  // دریافت یک محصول برای مشتری
  @Get(':id')
  findOneForCustomer(@Param('id') id: string, @Query('lang') language: string) {
    return this.productsService.findOneForCustomer(parseInt(id), language || 'fa');
  }

  // دریافت محصولات فروشنده (برای پنل فروشنده)
  @Get('seller/my-products')
  @UseGuards(JwtAuthGuard, SellerGuard)
  findSellerProducts(@Req() req: any) {
    return this.productsService.findBySeller(req.user.id);
  }

  // به‌روزرسانی محصول
  @Patch(':id')
  @UseGuards(JwtAuthGuard, SellerGuard)
  update(@Param('id') id: string, @Body() updateData: any, @Req() req: any) {
    return this.productsService.update(parseInt(id), updateData, req.user.id);
  }

  // حذف محصول
  @Delete(':id')
  @UseGuards(JwtAuthGuard, SellerGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.productsService.remove(parseInt(id), req.user.id);
  }
}
