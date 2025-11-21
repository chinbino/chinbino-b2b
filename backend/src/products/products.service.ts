import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private currencyService: CurrencyService,
  ) {}

  // ایجاد محصول جدید توسط فروشنده چینی
  async create(createProductDto: CreateProductDto, sellerId: number): Promise<Product> {
    const product = this.productsRepository.create({
      ...createProductDto,
      seller: { id: sellerId },
    });
    
    // محاسبه خودکار قیمت کارتن
    product.calculateCartonPrice();
    
    return await this.productsRepository.save(product);
  }

  // دریافت همه محصولات فعال برای مشتری
  async findAllForCustomer(language: string = 'fa') {
    const products = await this.productsRepository.find({
      where: { status: 'active' },
      relations: ['seller'],
    });

    return await Promise.all(
      products.map(async (product) => this.formatProductForCustomer(product, language))
    );
  }

  // دریافت یک محصول برای مشتری
  async findOneForCustomer(id: number, language: string = 'fa') {
    const product = await this.productsRepository.findOne({
      where: { id, status: 'active' },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    return await this.formatProductForCustomer(product, language);
  }

  // فرمت محصول برای نمایش به مشتری
  private async formatProductForCustomer(product: Product, language: string) {
    const priceInToman = await this.currencyService.convertCNYtoIRR(product.price_cny);
    const pricePerCartonToman = await this.currencyService.convertCNYtoIRR(product.price_per_carton_cny);

    return {
      id: product.id,
      name: language === 'fa' ? product.name_fa : product.name_zh,
      description: language === 'fa' ? product.description_fa : product.description_zh,
      specifications: {
        weight_kg: product.weight_kg,
        volume_cbm: product.volume_cbm,
        items_per_carton: product.items_per_carton,
        min_order_qty: product.min_order_qty,
      },
      pricing: {
        price_cny: product.price_cny,
        price_toman: priceInToman,
        price_per_carton_cny: product.price_per_carton_cny,
        price_per_carton_toman: pricePerCartonToman,
      },
      seller_info: {
        market_name: product.market_name,
        booth_number: product.booth_number,
        company_name: language === 'fa' ? product.seller.company_name_fa : product.seller.company_name_zh,
      },
      shipping: {
        available_methods: ['iyuo', 'dubai', 'iran'],
      },
    };
  }

  // دریافت محصولات یک فروشنده
  async findBySeller(sellerId: number) {
    return await this.productsRepository.find({
      where: { seller: { id: sellerId } },
      order: { created_at: 'DESC' },
    });
  }

  // به‌روزرسانی محصول
  async update(id: number, updateData: Partial<Product>, sellerId: number) {
    const product = await this.productsRepository.findOne({
      where: { id, seller: { id: sellerId } },
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    await this.productsRepository.update(id, updateData);
    return await this.productsRepository.findOne({ where: { id } });
  }

  // حذف محصول (غیرفعال کردن)
  async remove(id: number, sellerId: number) {
    const product = await this.productsRepository.findOne({
      where: { id, seller: { id: sellerId } },
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    await this.productsRepository.update(id, { status: 'inactive' });
    return { message: 'محصول با موفقیت حذف شد' };
  }
}
