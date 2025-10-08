export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

export interface PrintOptions {
  copies: number;
  colorType: 'color' | 'bw';
  sides: 'single' | 'double';
  paperSize: 'A4' | 'A3' | 'Legal' | 'Letter';
}

export interface PrintOrder {
  file: File;
  fileName: string;
  fileSize: number;
  pageCount: number;
  options: PrintOptions;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  printOrders: PrintOrder[];
}

export interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  printOrders: PrintOrder[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'new' | 'in_progress' | 'ready' | 'completed';
  orderDate: string;
  paymentStatus: 'pending' | 'paid';
}
