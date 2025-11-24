import { Product } from '../../products/entities/product.entity';

export interface OrderCalculationResult {
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  totalWeight: number;
  totalVolume: number;
  cartonCount: number;
}

export interface OrderItemCalculation {
  product: Product;
  quantity: number;
  cartonQuantity: number;
  unitPrice: number;
  totalPrice: number;
  totalWeight: number;
  totalVolume: number;
}
