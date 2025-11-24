import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return await this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  async findAll(@Request() req) {
    return await this.ordersService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.ordersService.findOne(id, req.user.id);
  }

  @Delete(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req) {
    return await this.ordersService.cancelOrder(id, req.user.id);
  }
}
