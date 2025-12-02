import { Controller, Get, Render, Param } from '@nestjs/common';

@Controller('admin/sellers')
export class AdminSellersController {
  
  @Get()
  @Render('sellers-list')
  getSellers() {
    const sellers = [
      {
        id: 1,
        name: 'شرکت نمونه ایرانیان',
        email: 'info@iranian-sample.com',
        phone: '021-12345678',
        status: 'active',
        isVerified: true,
        createdAt: '۱۴۰۳/۰۹/۱۲',
        productCount: 42,
        orderCount: 128
      },
      {
        id: 2,
        name: 'فروشگاه آنلاین تست',
        email: 'sales@test-shop.com',
        phone: '09123456789',
        status: 'inactive',
        isVerified: false,
        createdAt: '۱۴۰۳/۰۹/۱۰',
        productCount: 15,
        orderCount: 37
      }
    ];

    return {
      title: 'مدیریت فروشندگان',
      sellers,
      totalSellers: 2,
      activeSellers: 1,
      recentSellers: 1,
      currentDate: new Date().toLocaleDateString('fa-IR')
    };
  }

  @Get('create')
  @Render('seller-create')
  getCreatePage() {
    return {
      title: 'ایجاد فروشنده جدید',
      currentDate: new Date().toLocaleDateString('fa-IR')
    };
  }

  @Get(':id/edit')
  @Render('seller-edit')
  getEditPage(@Param('id') id: string) {
    const seller = {
      id: parseInt(id),
      name: 'شرکت نمونه ایرانیان',
      email: 'info@iranian-sample.com',
      phone: '021-12345678',
      website: 'https://iranian-sample.com',
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      status: 'active',
      taxId: '123456789',
      commission: 15.5,
      isVerified: true,
      createdAt: '۱۴۰۳/۰۹/۱۲',
      updatedAt: '۱۴۰۳/۰۹/۱۳',
      productCount: 42,
      orderCount: 128
    };

    return {
      title: `ویرایش فروشنده #${id}`,
      seller,
      currentDate: new Date().toLocaleDateString('fa-IR')
    };
  }
}
