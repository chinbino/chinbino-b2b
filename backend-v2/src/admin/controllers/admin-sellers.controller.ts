import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('admin/sellers')
export class AdminSellersController {
  
  @Get()
  getSellers(@Res() res: Response) {
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>مدیریت فروشندگان - ChinBino</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
              body { background-color: #f8f9fa; padding-top: 20px; }
              .persian-font { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
              .status-active { color: #198754; }
              .status-inactive { color: #dc3545; }
          </style>
      </head>
      <body class="persian-font">
          <div class="container">
              <div class="header p-4 rounded-3 mb-4 shadow">
                  <h1 class="display-5 fw-bold">🛒 پنل مدیریت فروشندگان</h1>
                  <p class="lead">ChinBino B2B Backend - Phase C2.1</p>
                  <p class="mb-0">آدرس سرور: <code>https://chinbino-api-v2.onrender.com</code></p>
              </div>
              
              <div class="card shadow mb-4">
                  <div class="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 class="mb-0">لیست فروشندگان</h5>
                      <a href="/admin/sellers/create" class="btn btn-success">➕ ایجاد فروشنده جدید</a>
                  </div>
                  <div class="card-body">
                      <div class="table-responsive">
                          <table class="table table-hover">
                              <thead>
                                  <tr>
                                      <th>#</th>
                                      <th>نام فروشنده</th>
                                      <th>ایمیل</th>
                                      <th>وضعیت</th>
                                      <th>تاریخ ثبت</th>
                                      <th>عملیات</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                      <td>1</td>
                                      <td>شرکت نمونه ایرانیان</td>
                                      <td>info@iranian-sample.com</td>
                                      <td><span class="status-active">✅ فعال</span></td>
                                      <td>۱۴۰۳/۰۹/۱۲</td>
                                      <td>
                                          <a href="/admin/sellers/1/edit" class="btn btn-sm btn-outline-primary">ویرایش</a>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td>2</td>
                                      <td>فروشگاه آنلاین تست</td>
                                      <td>sales@test-shop.com</td>
                                      <td><span class="status-inactive">⛔ غیرفعال</span></td>
                                      <td>۱۴۰۳/۰۹/۱۰</td>
                                      <td>
                                          <a href="/admin/sellers/2/edit" class="btn btn-sm btn-outline-primary">ویرایش</a>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
              
              <div class="alert alert-info">
                  <h6>📝 وضعیت سیستم:</h6>
                  <ul class="mb-0">
                      <li>✅ سرور NestJS اجرا شد</li>
                      <li>✅ مسیرهای پنل ادمین فعال شد</li>
                      <li>⚠️ Viewهای Handlebars به زودی اضافه می‌شوند</li>
                      <li>🔜 Phase بعدی: اتصال به دیتابیس PostgreSQL</li>
                  </ul>
              </div>
              
              <div class="text-center text-muted mt-4">
                  <p>ChinBino B2B Backend V2 | توسعه داده شده با NestJS & TypeScript</p>
              </div>
          </div>
      </body>
      </html>
    `;
    
    res.send(html);
  }

  @Get('create')
  getCreatePage(@Res() res: Response) {
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ایجاد فروشنده - ChinBino</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body style="padding: 40px; background-color: #f8f9fa;">
          <div class="container">
              <div class="card shadow">
                  <div class="card-header bg-primary text-white">
                      <h4 class="mb-0">➕ ایجاد فروشنده جدید</h4>
                  </div>
                  <div class="card-body">
                      <div class="alert alert-warning">
                          <p class="mb-0">📢 این صفحه در حال توسعه است. فرم ایجاد فروشنده به زودی اضافه خواهد شد.</p>
                      </div>
                      
                      <div class="mt-4">
                          <h5>اطلاعات نمونه:</h5>
                          <p>در این صفحه می‌توانید:</p>
                          <ul>
                              <li>اطلاعات فروشنده جدید را وارد کنید</li>
                              <li>مشخصات تماس و آدرس را ثبت کنید</li>
                              <li>تنظیمات حساب کاربری را مشخص کنید</li>
                          </ul>
                      </div>
                      
                      <div class="mt-4">
                          <a href="/admin/sellers" class="btn btn-secondary">↩️ بازگشت به لیست فروشندگان</a>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;
    
    res.send(html);
  }

  @Get(':id/edit')
  getEditPage(@Param('id') id: string, @Res() res: Response) {
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ویرایش فروشنده - ChinBino</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body style="padding: 40px; background-color: #f8f9fa;">
          <div class="container">
              <div class="card shadow">
                  <div class="card-header bg-warning">
                      <h4 class="mb-0">✏️ ویرایش فروشنده #${id}</h4>
                  </div>
                  <div class="card-body">
                      <div class="alert alert-info">
                          <p class="mb-0">📝 این صفحه در حال توسعه است. فرم ویرایش فروشنده به زودی اضافه خواهد شد.</p>
                      </div>
                      
                      <div class="mt-4">
                          <h5>فروشنده شماره ${id}</h5>
                          <p>در این صفحه می‌توانید اطلاعات فروشنده را ویرایش کنید.</p>
                          
                          <div class="card mt-3">
                              <div class="card-body">
                                  <h6>اطلاعات فعلی (نمونه):</h6>
                                  <ul class="mb-0">
                                      <li>نام: شرکت نمونه ${id}</li>
                                      <li>ایمیل: seller${id}@example.com</li>
                                      <li>وضعیت: فعال</li>
                                      <li>تاریخ ثبت: ۱۴۰۳/۰۹/۱۰</li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                      
                      <div class="mt-4">
                          <a href="/admin/sellers" class="btn btn-secondary">↩️ بازگشت به لیست فروشندگان</a>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;
    
    res.send(html);
  }
}
