
// src/types/index.ts
import type { PortableTextBlock } from '@portabletext/react';

export interface SanityFlavour {
  _id: string;
  name: string;
  imageUrl: string;
  price?: number;
}

export interface SanityProduct {
  _id: string;
  name: string;
  slug: { current: string };
  mrp?: number;
  discountedPrice?: number;
  images?: string[];
  weight?: string;
  packageType?: string;
  composition?: string;
  description?: PortableTextBlock[];
  ingredients?: string;
  allergenAlert?: PortableTextBlock[];
  availableFlavours?: SanityFlavour[];
  bestFor?: string[];
  filterOptions?: {
    title: string;
    category: string;
  }[];
  numberOfChocolates?: number;
}

export interface StructuredFilter {
  _id: string;
  title: string;
  icon?: string | null;
  options: {
    _id: string;
    title: string;
  }[];
}

export type OrderItem = {
  name: string;
  quantity: number;
  flavours?: { name: string, price: number }[];
  mrp?: number;
  finalProductPrice?: number;
  finalSubtotal?: number;
  coverImage?: string;
};

export interface Order {
  id: string;
  uid: string;
  date: string;
  items: OrderItem[];
  status: 'Order Requested' | 'In Progress' | 'Completed' | 'Cancelled';
  total: number;
  totalDiscount?: number;
  gstPercentage?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  cancelledBy?: 'user' | 'admin';
  rating?: number;
  feedback?: string;
}
