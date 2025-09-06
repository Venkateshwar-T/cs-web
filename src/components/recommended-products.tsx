// @/components/recommended-products.tsx
'use client';

import { ProductCard } from './product-card';
import { SectionTitle } from './section-title';
import type { Product } from '@/app/page';

interface RecommendedProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
  likedProducts: Record<number, boolean>;
  onLikeToggle: (productId: number) => void;
}

export function RecommendedProducts({
  products,
  onProductClick,
  onAddToCart,
  cart,
  likedProducts,
  onLikeToggle,
}: RecommendedProductsProps) {
  return (
    <div className="py-8 md:mx-32">
      <SectionTitle className="text-xl md:text-2xl mb-4 px-4 md:px-0">
        Recommended for you
      </SectionTitle>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-4 md:px-0">
        {products.slice(0,6).map(product => (
          <div key={product.id} className="w-full">
            <ProductCard
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              quantity={cart[product.name] || 0}
              isLiked={!!likedProducts[product.id]}
              onLikeToggle={() => onLikeToggle(product.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
