
// @/components/featured-products.tsx
'use client';

import { ProductCard } from './product-card';
import { SectionTitle } from './section-title';
import type { Product } from '@/app/page';

interface FeaturedProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
  likedProducts: Record<number, boolean>;
  onLikeToggle: (productId: number) => void;
}

export function FeaturedProducts({
  products,
  onProductClick,
  onAddToCart,
  cart,
  likedProducts,
  onLikeToggle,
}: FeaturedProductsProps) {
  return (
    <div className="py-8 bg-[#9A7DAB] rounded-[40px] ring-4 ring-custom-purple-dark px-4 sm:px-6 lg:px-8">
      <SectionTitle className="text-xl md:text-2xl mb-4 px-4 md:px-0 text-white">
        You might also like
      </SectionTitle>
      <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-6 px-4 md:px-0">
        {products.map(product => (
          <div key={product.id} className="w-48 md:w-64 flex-shrink-0">
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
