import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemsRepo: Repository<OrderItem>
  ) {}

  async create(data: { buyerId: number; items: { productId: number; quantity: number; }[]; }): Promise<Order> {
    const order = this.ordersRepo.create({ buyerId: data.buyerId });
    order.items = data.items.map(item => this.itemsRepo.create(item));
    return this.ordersRepo.save(order);
  }

  async findOne(id: number): Promise<Order> {
    return this.ordersRepo.findOne({
      where: { id },
      relations: ['items']
    });
  }
}
