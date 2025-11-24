import { OrderStatus, PaymentStatus } from '../entities/order-status.enum';

export class OrderItemResponseDto {
  id: string;
  product: {
    id: string;
    titleFa: string;
    titleZh?: string;
    basePriceCNY: number;
  };
  quantity: number;
  cartonQuantity: number;
  unitPrice: number;
  totalPrice: number;
  totalWeight?: number;
  totalVolume?: number;
}

export class OrderResponseDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  shippingAddress?: string;
  shippingMethod?: string;
  items: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
