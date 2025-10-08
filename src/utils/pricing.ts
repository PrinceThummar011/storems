import { PrintOptions } from '../types';

export const PRINT_PRICING = {
  A4: {
    bw: { single: 2, double: 3 },
    color: { single: 10, double: 15 }
  },
  A3: {
    bw: { single: 5, double: 7 },
    color: { single: 20, double: 28 }
  },
  Legal: {
    bw: { single: 3, double: 4 },
    color: { single: 12, double: 17 }
  },
  Letter: {
    bw: { single: 2, double: 3 },
    color: { single: 10, double: 15 }
  }
};

export function calculatePrintPrice(
  pageCount: number,
  options: PrintOptions
): number {
  const { copies, colorType, sides, paperSize } = options;
  const basePrice = PRINT_PRICING[paperSize][colorType][sides];
  return basePrice * pageCount * copies;
}

export function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${random}`;
}
