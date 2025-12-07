import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: { buyerId: number; items: { productId: number; quantity: number; }[]; }) {
    const order = await this.ordersService.create(body);
    return { message: 'Order created', data: order };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.findOne(id);
    return order || { message: 'Order not found' };
  }
}
