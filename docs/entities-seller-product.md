
````markdown
# Seller & Product Entities – Chinbino B2B (Phase C1 / C3)

این سند، طراحی اولیه موجودیت‌های **Seller** و ارتباط آن با **User** و **Product** را برای فاز B2B در پروژه Chinbino مشخص می‌کند.

هدف:  
- اضافه کردن هسته B2B (فروشنده‌محور)  
- بدون تخریب CMS یا ماژول‌های موجود  
- با ساختار تمیز و قابل گسترش در NestJS + TypeORM

---

## 1. اصول طراحی

1. Seller یک موجودیت مستقل است (جدا از User).
2. هر Seller می‌تواند چند User داشته باشد (کارمندان/مسئولان آن فروشنده).
3. هر Product فقط به **یک Seller** متصل است (مالک محصول).
4. در فاز فعلی فقط روی مدل داده و Admin ساده تمرکز می‌کنیم؛  
   منطق پیچیده سفارش/پرداخت/حمل در فازهای بعدی اضافه می‌شود.

---

## 2. Entity: Seller

### 2.1. توضیح کلی

Seller نماینده‌ی یک فروشنده/تأمین‌کننده چینی در سیستم Chinbino است.  
این موجودیت به User و Product متصل می‌شود.

### 2.2. فیلدها (پیشنهاد اولیه)

نام Entity:

```ts
Seller
````

فیلدها:

* `id: number` – کلید اصلی
* `nameZh: string` – نام فروشنده به چینی (ضروری)
* `nameFa?: string` – نام فروشنده به فارسی (اختیاری در فاز اول)
* `companyName?: string` – نام شرکت/برند
* `contactPerson?: string` – نام شخص تماس
* `phone?: string` – شماره تماس
* `wechatId?: string` – آیدی وی‌چت
* `aliwangwangId?: string` – آیدی علی‌وانگ‌وانگ (اختیاری)
* `location?: string` – محل فعالیت (مثال: "Yiwu – Futian Market District 1")
* `descriptionZh?: string` – توضیحات به چینی (اختیاری / فاز بعدی)
* `descriptionFa?: string` – توضیحات به فارسی (اختیاری / فاز بعدی)
* `createdAt: Date`
* `updatedAt: Date`

رابطه‌ها:

* `users: User[]` – یک Seller می‌تواند چند User داشته باشد.
* `products: Product[]` – یک Seller می‌تواند چند Product داشته باشد.

### 2.3. پیشنهاد پیاده‌سازی TypeORM (نمونه)

> این فقط نمونه طراحی است، نه الزام نهایی. پیاده‌سازی واقعی باید با ساختار فعلی پروژه هماهنگ شود.

```ts
// src/sellers/entities/seller.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'sellers' })
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_zh', type: 'varchar', length: 255 })
  nameZh: string;

  @Column({ name: 'name_fa', type: 'varchar', length: 255, nullable: true })
  nameFa?: string;

  @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true })
  companyName?: string;

  @Column({ name: 'contact_person', type: 'varchar', length: 255, nullable: true })
  contactPerson?: string;

  @Column({ name: 'phone', type: 'varchar', length: 100, nullable: true })
  phone?: string;

  @Column({ name: 'wechat_id', type: 'varchar', length: 255, nullable: true })
  wechatId?: string;

  @Column({ name: 'aliwangwang_id', type: 'varchar', length: 255, nullable: true })
  aliwangwangId?: string;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ name: 'description_zh', type: 'text', nullable: true })
  descriptionZh?: string;

  @Column({ name: 'description_fa', type: 'text', nullable: true })
  descriptionFa?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.seller)
  users: User[];

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
```

> نکته: فیلدهای description می‌توانند در فاز فعلی خالی بمانند و بعداً استفاده شوند.

---

## 3. ارتباط Seller ↔ User

### 3.1. مدل مفهومی

* یک Seller می‌تواند چند User داشته باشد (مثلاً چند کارمند).
* هر User حداکثر به **یک Seller** متصل است.
  (در صورت نیاز به مدل پیچیده‌تر در آینده می‌توان Many-to-Many کرد، اما برای فاز فعلی لازم نیست.)

### 3.2. تغییر در User Entity (پیشنهادی)

در `User` (مسیر واقعی پروژه ممکن است `src/users/entities/user.entity.ts` باشد):

```ts
// src/users/entities/user.entity.ts

import { ManyToOne } from 'typeorm';
import { Seller } from '../../sellers/entities/seller.entity';

@ManyToOne(() => Seller, (seller) => seller.users, { nullable: true })
seller?: Seller;
```

یا اگر فقط `sellerId` نگه‌داری شود:

```ts
@Column({ name: 'seller_id', type: 'int', nullable: true })
sellerId?: number;
```

> انتخاب بین رابطه کامل یا فقط نگه‌داشتن `sellerId` بستگی به معماری فعلی دارد. اگر الان User Entity به‌شدت درگیر TypeORM است، پیشنهاد می‌شود از رابطه ManyToOne کامل استفاده شود.

---

## 4. ارتباط Seller ↔ Product

### 4.1. مدل مفهومی

* هر Product به یک Seller وابسته است.
* یک Seller می‌تواند چند محصول داشته باشد.

### 4.2. تغییر در Product Entity (پیشنهادی)

در `Product` (مثلاً `src/products/entities/product.entity.ts`):

```ts
// src/products/entities/product.entity.ts

import { ManyToOne } from 'typeorm';
import { Seller } from '../../sellers/entities/seller.entity';

@ManyToOne(() => Seller, (seller) => seller.products, { nullable: true })
seller?: Seller;
```

یا اگر ترجیح داده شود:

```ts
@Column({ name: 'seller_id', type: 'int', nullable: true })
sellerId?: number;
```

> پیشنهاد: در نهایت بهتر است هم `sellerId` ذخیره شود، هم رابطه TypeORM تعریف شود.

---

## 5. B2B Fields در Product (ارتباط با Phase C3)

این بخش به Phase C3 مربوط است، اما برای درک ارتباط، در همین سند آورده می‌شود.
پیاده‌سازی کامل این بخش بعد از Seller انجام می‌شود.

### 5.1. فیلدهای پیشنهادی Product برای B2B

در Entity `Product` (پیشنهاد):

* `minOrderQuantity: number` – حداقل تعداد سفارش (MOQ)
* `cartonQuantity: number` – تعداد واحد در هر کارتن
* `cartonVolume?: number` – حجم کارتن (مثلاً CBM)
* `cartonWeight?: number` – وزن کارتن (کیلوگرم)
* `priceYuan: number` – قیمت پایه به یوان (EXW)
* `priceYuanFob?: number` – قیمت FOB به یوان (اختیاری)
* `currencyDisplay?: 'yuan' | 'yuan_toman'` – نحوه نمایش قیمت

نمونه TypeORM:

```ts
// در src/products/entities/product.entity.ts

@Column({ name: 'min_order_quantity', type: 'int', default: 1 })
minOrderQuantity: number;

@Column({ name: 'carton_quantity', type: 'int', nullable: true })
cartonQuantity?: number;

@Column({ name: 'carton_volume', type: 'float', nullable: true })
cartonVolume?: number;

@Column({ name: 'carton_weight', type: 'float', nullable: true })
cartonWeight?: number;

@Column({ name: 'price_yuan', type: 'decimal', precision: 10, scale: 2, nullable: true })
priceYuan?: number;

@Column({ name: 'price_yuan_fob', type: 'decimal', precision: 10, scale: 2, nullable: true })
priceYuanFob?: number;

@Column({
  name: 'currency_display',
  type: 'varchar',
  length: 20,
  default: 'yuan',
})
currencyDisplay: 'yuan' | 'yuan_toman';
```

---

## 6. ساختار ماژول‌ها در NestJS (پیشنهادی)

### 6.1. ماژول Seller

پیشنهاد مسیر:

```text
src/sellers/
  ├── sellers.module.ts
  ├── sellers.service.ts
  ├── sellers.controller.ts
  └── entities/
      └── seller.entity.ts
```

* `sellers.module.ts` – ثبت Entity و Service/Controller
* `sellers.service.ts` – CRUD فروشنده‌ها
* `sellers.controller.ts` – APIهای لازم (در فاز اول فقط برای Admin)

### 6.2. اتصال به Admin (در فاز بعد)

در فاز بعدی (C1.2)، برای Admin صفحات زیر لازم است:

* `/admin/sellers` – لیست فروشنده‌ها
* `/admin/sellers/new` – افزودن فروشنده
* `/admin/sellers/:id/edit` – ویرایش فروشنده

پیاده‌سازی UI Admin برای Seller در سند دیگری (مثلاً `docs/admin-seller-ui.md`) توضیح داده خواهد شد.

---

## 7. قوانین اجرا (Phase C1 / C3)

1. در هنگام پیاده‌سازی این Entityها:

   * ماژول‌های فعلی CMS، Admin Contents، و Render نباید شکسته شوند.
2. قبل از هر Migration جدید:

   * وضعیت فعلی دیتابیس و Entityهای موجود باید بررسی شود.
3. هر تغییری در `User` و `Product` باید با حداقل ریسک و با تست دستی روی Render انجام شود.

---

این سند مبنای پیاده‌سازی Phase C1 (Seller Center – مدل داده) و Phase C3 (B2B Product Fields) است.
قبل از کدنویسی، هر تغییری در این طراحی باید با صاحب پروژه هماهنگ شود.

```

---
