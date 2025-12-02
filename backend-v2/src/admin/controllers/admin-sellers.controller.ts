import { Controller, Get, Render, Param } from '@nestjs/common';

@Controller('admin/sellers')
export class AdminSellersController {
  
  @Get()
  @Render('sellers-list')
  async getSellers() {
    // داده موقت برای تست
    const sellers = [
      { 
        id: 1, 
        name: 'شرکت نمونه ۱', 
        email: 'seller1@example.com', 
        phone: '09123456789',
        status: 'active',
        createdAt: '۱۴۰۳/۰۹/۱۲'
      },
      { 
        id: 2, 
        name: 'شرکت نمونه ۲', 
        email: 'seller2@example.com', 
        phone: '09129876543',
        status: 'inactive',
        createdAt: '۱۴۰۳/۰۹/۱۰'
      }
    ];
    
    return { 
      title: 'مدیریت فروشندگان',
      sellers,
      total: 2,
      page: 1,
      pages: 1
    };
  }

  @Get('create')
  @Render('seller-create')
  getCreatePage() {
    return { title: 'ایجاد فروشنده جدید' };
  }

  @Get(':id/edit')
  @Render('seller-edit')
  getEditPage(@Param('id') id: string) {
    return { 
      title: `ویرایش فروشنده #${id}`,
      id 
    };
  }
}
