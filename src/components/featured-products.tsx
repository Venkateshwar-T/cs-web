// @/components/featured-products.tsx
'use client';

import { ProductCard } from './product-card';
import { SectionTitle } from './section-title';
import type { Product } from '@/app/page';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

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
  const router = useRouter();

  const handleViewMore = () => {
    router.push('/search?q=');
  };

  return (
    <div className="py-8 bg-[#9A7DAB] rounded-[40px] ring-4 ring-custom-purple-dark px-4 sm:px-6 lg:px-8">
      <SectionTitle className="text-xl md:text-2xl mb-4 px-4 md:px-0 text-white">
        You might also like
      </SectionTitle>
      <div className="flex items-stretch overflow-x-auto no-scrollbar gap-4 md:gap-6 px-4 pt-4 pb-4">
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
        <div className="w-48 md:w-64 flex-shrink-0 flex">
           <Button
            variant="outline"
            onClick={handleViewMore}
            className="w-full h-full bg-white/20 border-2 border-dashed border-white/50 text-white hover:bg-white/30 hover:text-white flex flex-col items-center justify-center gap-2 rounded-2xl"
          >
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <ChevronRight className="h-10 w-10" />
            </div>
            <span className="font-semibold text-lg">View More</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
