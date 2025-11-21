import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  private exchangeRates = {
    CNY_TO_IRR: 56000, // نرخ تقریبی - بعداً از سرویس واقعی بگیریم
  };

  async convertCNYtoIRR(amountCNY: number): Promise<number> {
    return Math.round(amountCNY * this.exchangeRates.CNY_TO_IRR);
  }

  async convertIRRtoCNY(amountIRR: number): Promise<number> {
    return amountIRR / this.exchangeRates.CNY_TO_IRR;
  }

  // برای تست - بعداً با سرویس واقعی جایگزین می‌شود
  getExchangeRate(from: string, to: string): number {
    if (from === 'CNY' && to === 'IRR') {
      return this.exchangeRates.CNY_TO_IRR;
    }
    return 1;
  }
}
