export interface ProductColor {
  id: string;
  name: string;
  value: string; // hex color value
  images: string[];
}

export interface ProductSize {
  id: string;
  name: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  colors?: ProductColor[];
  sizes?: ProductSize[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  isAdmin: boolean;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export type Language = "en" | "fr" | "ar";

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  rtl: boolean;
}

export interface Translations {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
}
