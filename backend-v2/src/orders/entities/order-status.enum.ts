export enum OrderStatus {
  PENDING = 'pending',           // در انتظار تأیید
  CONFIRMED = 'confirmed',       // تأیید شده
  PROCESSING = 'processing',     // در حال پردازش
  SHIPPED = 'shipped',           // ارسال شده
  DELIVERED = 'delivered',       // تحویل داده شده
  CANCELLED = 'cancelled',       // لغو شده
  REFUNDED = 'refunded'          // مرجوع شده
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}
