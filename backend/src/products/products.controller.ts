import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

// موقتاً Guardها رو غیرفعال می‌کنیم تا تست بشه
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { SellerGuard } from '../auth/guards/seller.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ایجاد محصول جدید (فروشنده چینی) - موقتاً بدون Guard
  @Post()
  // @UseGuards(JwtAuthGuard, SellerGuard)
  create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
    // موقتاً sellerId ثابت می‌دیم
    return this.productsService.create(createProductDto, 1);
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

  // دریافت محصولات فروشنده (برای پنل فروشنده) - موقتاً بدون Guard
  @Get('seller/my-products')
  // @UseGuards(JwtAuthGuard, SellerGuard)
  findSellerProducts(@Req() req: any) {
    // موقتاً sellerId ثابت می‌دیم
    return this.productsService.findBySeller(1);
  }

  // به‌روزرسانی محصول - موقتاً بدون Guard
  @Patch(':id')
  // @UseGuards(JwtAuthGuard, SellerGuard)
  update(@Param('id') id: string, @Body() updateData: any, @Req() req: any) {
    // موقتاً sellerId ثابت می‌دیم
    return this.productsService.update(parseInt(id), updateData, 1);
  }

  // حذف محصول - موقتاً بدون Guard
  @Delete(':id')
  // @UseGuards(JwtAuthGuard, SellerGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    // موقتاً sellerId ثابت می‌دیم
    return this.productsService.remove(parseInt(id), 1);
  }
}
