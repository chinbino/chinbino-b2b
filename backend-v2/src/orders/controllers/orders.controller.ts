import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrderResponseDto } from '../dto/order-response.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const order = await this.ordersService.create(createOrderDto, req.user.id);
    return this.mapToResponseDto(order);
  }

  @Get()
  async findAll(@Request() req) {
    const orders = await this.ordersService.findAll(req.user.id);
    return orders.map(order => this.mapToResponseDto(order));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const order = await this.ordersService.findOne(id, req.user.id);
    return this.mapToResponseDto(order);
  }

  @Delete(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req) {
    const order = await this.ordersService.cancelOrder(id, req.user.id);
    return this.mapToResponseDto(order);
  }

  private mapToResponseDto(order: any): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      taxAmount: Number(order.taxAmount),
      shippingCost: Number(order.shippingCost),
      totalAmount: Number(order.totalAmount),
      shippingAddress: order.shippingAddress,
      shippingMethod: order.shippingMethod,
      items: order.items.map(item => ({
        id: item.id,
        product: {
          id: item.product.id,
          titleFa: item.product.titleFa,
          titleZh: item.product.titleZh,
          basePriceCNY: Number(item.product.basePriceCNY),
        },
        quantity: item.quantity,
        cartonQuantity: item.cartonQuantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        totalWeight: item.totalWeight ? Number(item.totalWeight) : undefined,
        totalVolume: item.totalVolume ? Number(item.totalVolume) : undefined,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
