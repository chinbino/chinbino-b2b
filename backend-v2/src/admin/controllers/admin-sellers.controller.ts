import { Controller, Get, Render, Param } from '@nestjs/common';

@Controller('admin/sellers')
export class AdminSellersController {
  
  @Get()
  @Render('main') // استفاده از layout اصلی
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
        updatedAt: '۱۴۰۳/۰۹/۱۵',
        website: 'https://iranian-sample.com',
        address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
        country: 'ایران',
        taxId: '1234567890',
        commissionRate: 15,
        productCount: 42,
        orderCount: 128,
        rating: 4.8
      },
      {
        id: 2,
        name: 'فروشگاه آنلاین تست',
        email: 'sales@test-shop.com',
        phone: '09123456789',
        status: 'inactive',
        isVerified: false,
        createdAt: '۱۴۰۳/۰۹/۱۰',
        updatedAt: '۱۴۰۳/۰۹/۱۲',
        website: 'https://test-shop.com',
        address: 'اصفهان، خیابان چهارباغ',
        country: 'ایران',
        taxId: '0987654321',
        commissionRate: 12.5,
        productCount: 15,
        orderCount: 37,
        rating: 4.2
      },
      {
        id: 3,
        name: 'شرکت بین‌المللی تجارت',
        email: 'contact@trade-int.com',
        phone: '021-98765432',
        status: 'pending',
        isVerified: false,
        createdAt: '۱۴۰۳/۰۹/۱۸',
        updatedAt: '۱۴۰۳/۰۹/۱۸',
        website: 'https://trade-int.com',
        address: 'شیراز، بلوار زرین',
        country: 'ایران',
        taxId: '5678901234',
        commissionRate: 18,
        productCount: 0,
        orderCount: 0,
        rating: 0
      }
    ];

    const activeSellers = sellers.filter(s => s.status === 'active').length;
    const verifiedSellers = sellers.filter(s => s.isVerified).length;
    const recentSellers = sellers.filter(s => {
      // فرض: فروشندگان ۷ روز اخیر
      return s.id >= 2; // برای نمونه
    }).length;

    return {
      title: 'مدیریت فروشندگان',
      currentDate: new Date().toLocaleDateString('fa-IR'),
      partial: 'sellers-list', // نام partial
      sellers: sellers,
      totalSellers: sellers.length,
      activeSellers: activeSellers,
      recentSellers: recentSellers,
      verifiedSellers: verifiedSellers
    };
  }

  @Get('create')
  @Render('main') // استفاده از layout اصلی
  getCreatePage() {
    return {
      title: 'ایجاد فروشنده جدید',
      currentDate: new Date().toLocaleDateString('fa-IR'),
      partial: 'seller-create' // نام partial
    };
  }

  @Get(':id/edit')
  @Render('main') // استفاده از layout اصلی
  getEditPage(@Param('id') id: string) {
    const sellers = [
      {
        id: 1,
        name: 'شرکت نمونه ایرانیان',
        email: 'info@iranian-sample.com',
        phone: '021-12345678',
        status: 'active',
        isVerified: true,
        createdAt: '۱۴۰۳/۰۹/۱۲',
        updatedAt: '۱۴۰۳/۰۹/۱۵',
        website: 'https://iranian-sample.com',
        address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
        country: 'ایران',
        taxId: '1234567890',
        commissionRate: 15,
        productCount: 42,
        orderCount: 128,
        rating: 4.8
      },
      {
        id: 2,
        name: 'فروشگاه آنلاین تست',
        email: 'sales@test-shop.com',
        phone: '09123456789',
        status: 'inactive',
        isVerified: false,
        createdAt: '۱۴۰۳/۰۹/۱۰',
        updatedAt: '۱۴۰۳/۰۹/۱۲',
        website: 'https://test-shop.com',
        address: 'اصفهان، خیابان چهارباغ',
        country: 'ایران',
        taxId: '0987654321',
        commissionRate: 12.5,
        productCount: 15,
        orderCount: 37,
        rating: 4.2
      },
      {
        id: 3,
        name: 'شرکت بین‌المللی تجارت',
        email: 'contact@trade-int.com',
        phone: '021-98765432',
        status: 'pending',
        isVerified: false,
        createdAt: '۱۴۰۳/۰۹/۱۸',
        updatedAt: '۱۴۰۳/۰۹/۱۸',
        website: 'https://trade-int.com',
        address: 'شیراز، بلوار زرین',
        country: 'ایران',
        taxId: '5678901234',
        commissionRate: 18,
        productCount: 0,
        orderCount: 0,
        rating: 0
      }
    ];

    const sellerId = parseInt(id, 10);
    let seller = sellers.find(s => s.id === sellerId);
    
    // اگر فروشنده پیدا نشد، یک نمونه بساز
    if (!seller) {
      seller = {
        id: sellerId,
        name: `شرکت نمونه ${id}`,
        email: `seller${id}@example.com`,
        phone: '021-00000000',
        status: 'active',
        isVerified: true,
        createdAt: '۱۴۰۳/۰۹/۰۱',
        updatedAt: '۱۴۰۳/۰۹/۰۱',
        website: `https://company${id}.com`,
        address: 'آدرس نمونه',
        country: 'ایران',
        taxId: '0000000000',
        commissionRate: 10,
        productCount: 0,
        orderCount: 0,
        rating: 0
      };
    }

    return {
      title: `ویرایش فروشنده #${id}`,
      currentDate: new Date().toLocaleDateString('fa-IR'),
      partial: 'seller-edit', // نام partial
      seller: seller
    };
  }
}
