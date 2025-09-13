// src/types/index.ts
import type { PortableTextBlock } from '@portabletext/react';

export interface SanityFlavour {
  _id: string;
  name: string;
  imageUrl: string;
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
  allergenAlert?: string;
  availableFlavours?: SanityFlavour[];
  bestFor?: string[];
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
