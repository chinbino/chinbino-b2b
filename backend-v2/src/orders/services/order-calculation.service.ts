import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { OrderCalculationResult, OrderItemCalculation } from '../interfaces/order-calculation.interface';

@Injectable()
export class OrderCalculationService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async calculateOrder(items: Array<{ productId: string; quantity: number }>): Promise<{
    calculations: OrderItemCalculation[];
    summary: OrderCalculationResult;
  }> {
    const calculations: OrderItemCalculation[] = [];
    let totalWeight = 0;
    let totalVolume = 0;
    let totalCartons = 0;
    let subtotal = 0;

    // محاسبات برای هر آیتم
    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId, status: 'active' }
      });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // اعتبارسنجی حداقل سفارش
      if (!product.validateMinOrder(item.quantity)) {
        throw new Error(`Minimum order quantity not met for product: ${product.titleFa}`);
      }

      // محاسبه تعداد کارتن
      const cartonQuantity = product.calculateCartonQuantity(item.quantity);
      
      // محاسبه قیمت‌ها
      const unitPrice = product.basePriceCNY; // قیمت بر اساس یوان
      const totalPrice = unitPrice * item.quantity;

      // محاسبه وزن و حجم
      const itemWeight = cartonQuantity * (product.cartonWeightKg || 0);
      const itemVolume = cartonQuantity * (product.cartonVolumeM3 || 0);

      calculations.push({
        product,
        quantity: item.quantity,
        cartonQuantity,
        unitPrice,
        totalPrice,
        totalWeight: itemWeight,
        totalVolume: itemVolume,
      });

      // جمع‌آوری Totals
      subtotal += totalPrice;
      totalWeight += itemWeight;
      totalVolume += itemVolume;
      totalCartons += cartonQuantity;
    }

    // محاسبه هزینه حمل (ساده - بر اساس وزن)
    const shippingCost = this.calculateShippingCost(totalWeight);
    
    // محاسبه مالیات (فرضی 9%)
    const taxAmount = subtotal * 0.09;

    const totalAmount = subtotal + shippingCost + taxAmount;

    return {
      calculations,
      summary: {
        subtotal,
        shippingCost,
        taxAmount,
        totalAmount,
        totalWeight,
        totalVolume,
        cartonCount: totalCartons,
      },
    };
  }

  private calculateShippingCost(totalWeight: number): number {
    // محاسبه ساده هزینه حمل بر اساس وزن
    if (totalWeight <= 10) return 50; // 50 یوان برای تا 10 کیلو
    if (totalWeight <= 50) return 100; // 100 یوان برای تا 50 کیلو
    if (totalWeight <= 100) return 200; // 200 یوان برای تا 100 کیلو
    return 200 + Math.ceil((totalWeight - 100) / 50) * 50; // 50 یوان برای هر 50 کیلو اضافه
  }
}
