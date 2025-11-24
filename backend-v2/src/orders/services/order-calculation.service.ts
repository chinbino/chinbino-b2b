import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from '../../products/entities/product.entity';
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

    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId, status: ProductStatus.ACTIVE } // ✅ اصلاح شد
      });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (!product.validateMinOrder(item.quantity)) {
        throw new Error(`Minimum order quantity not met for product: ${product.titleFa}`);
      }

      const cartonQuantity = product.calculateCartonQuantity(item.quantity);
      const unitPrice = product.basePriceCNY;
      const totalPrice = unitPrice * item.quantity;
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

      subtotal += totalPrice;
      totalWeight += itemWeight;
      totalVolume += itemVolume;
      totalCartons += cartonQuantity;
    }

    const shippingCost = this.calculateShippingCost(totalWeight);
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
    if (totalWeight <= 10) return 50;
    if (totalWeight <= 50) return 100;
    if (totalWeight <= 100) return 200;
    return 200 + Math.ceil((totalWeight - 100) / 50) * 50;
  }
}
