// src/types/index.ts

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
