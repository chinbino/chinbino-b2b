import { Controller, Get, Render, Param } from '@nestjs/common';

@Controller('admin/sellers')
export class AdminSellersController {
  
  @Get()
  @Render('sellers-list') // فایل: sellers-list.hbs
  getSellers() {
    return {
      title: 'مدیریت فروشندگان',
      sellers: [
        { id: 1, name: 'شرکت نمونه', email: 'test@example.com', status: 'active' },
        { id: 2, name: 'فروشگاه تست', email: 'test2@example.com', status: 'inactive' }
      ],
      currentDate: new Date().toLocaleDateString('fa-IR')
    };
  }

  @Get('create')
  @Render('seller-create') // فایل: seller-create.hbs
  getCreatePage() {
    return {
      title: 'ایجاد فروشنده جدید',
      currentDate: new Date().toLocaleDateString('fa-IR')
    };
  }

  @Get(':id/edit')
  @Render('seller-edit') // فایل: seller-edit.hbs
  getEditPage(@Param('id') id: string) {
    return {
      title: `ویرایش فروشنده #${id}`,
      seller: {
        id: parseInt(id),
        name: `شرکت نمونه ${id}`,
        email: `seller${id}@example.com`,
        status: 'active'
      },
      currentDate: new Date().toLocaleDateString('fa-IR')
    };
  }
}
