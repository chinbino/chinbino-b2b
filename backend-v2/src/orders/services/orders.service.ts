import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus, PaymentStatus } from '../entities/order-status.enum';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderCalculationService } from './order-calculation.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly calculationService: OrderCalculationService,
  ) {}

  async create(createOrderDto: CreateOrderDto, buyerId: string) {
    // محاسبات سفارش
    const { calculations, summary } = await this.calculationService.calculateOrder(
      createOrderDto.items
    );

    // ایجاد سفارش
    const order = this.orderRepository.create({
      buyer: { id: buyerId },
      orderNumber: this.generateOrderNumber(),
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      subtotal: summary.subtotal,
      shippingCost: summary.shippingCost,
      taxAmount: summary.taxAmount,
      totalAmount: summary.totalAmount,
      shippingAddress: createOrderDto.shippingAddress,
      shippingMethod: createOrderDto.shippingMethod,
    });

    const savedOrder = await this.orderRepository.save(order);

    // ایجاد آیتم‌های سفارش
const orderItems = calculations.map(calc =>
  this.orderItemRepository.create({
    order: { id: savedOrder.id },  // ✅ اصلاح شد - فقط ID رو پاس بده
    product: { id: calc.product.id }, // اینم همینطور
    quantity: calc.quantity,
    cartonQuantity: calc.cartonQuantity,
    unitPrice: calc.unitPrice,
    totalPrice: calc.totalPrice,
    totalWeight: calc.totalWeight,
    totalVolume: calc.totalVolume,
  })
);

    await this.orderItemRepository.save(orderItems);

    return await this.findOne(savedOrder.id, buyerId);
  }

  async findAll(buyerId: string) {
    return await this.orderRepository.find({
      where: { buyer: { id: buyerId } },
      relations: ['items', 'items.product', 'buyer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, buyerId: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'buyer'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // بررسی دسترسی
    if (order.buyer.id !== buyerId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async cancelOrder(id: string, buyerId: string) {
    const order = await this.findOne(id, buyerId);

    if (order.status !== OrderStatus.PENDING) {
      throw new ForbiddenException('Only pending orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    return await this.orderRepository.save(order);
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}
