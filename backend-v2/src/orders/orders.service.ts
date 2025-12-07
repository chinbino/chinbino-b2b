import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {

  async createOrder(data: any) {
    return {
      message: 'Order created (mock)',
      data,
    };
  }

  async getOrderById(id: string) {
    return {
      id,
      status: 'pending',
    };
  }
}
