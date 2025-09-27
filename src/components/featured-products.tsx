// @/components/featured-products.tsx
'use client';

import { FeaturedProductCard } from './featured-product-card';
import { SectionTitle } from './section-title';
import type { SanityProduct } from '@/types';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FeaturedProductsProps {
  products: SanityProduct[];
  onProductClick: (product: SanityProduct) => void;
  onAddToCart: (product: SanityProduct) => void;
  onRemoveFromCart: (product: SanityProduct) => void;
  cart: Record<string, { name: string; quantity: number; flavours?: string[] }>;
  likedProducts: Record<string, boolean>;
  onLikeToggle: (productId: string) => void;
  isMobile?: boolean;
}

export function FeaturedProducts({
  products,
  onProductClick,
  onAddToCart,
  onRemoveFromCart,
  cart,
  likedProducts,
  onLikeToggle,
  isMobile = false,
}: FeaturedProductsProps) {
  const router = useRouter();

  const handleViewMore = () => {
    router.push('/search?q=');
  };

  return (
    <div className={cn(
      "bg-white/10 rounded-[20px] md:rounded-[40px] px-4 sm:px-6 lg:px-8",
      isMobile ? "py-4" : "py-6"
    )}>
      <SectionTitle className={cn(
        "text-white",
        isMobile ? "mb-4 text-base px-2" : "mb-6 text-xl md:text-2xl"
      )}>
        You might also like
      </SectionTitle>
      
      {isMobile ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {products.map(product => (
            <div key={product._id} className="w-40 flex-shrink-0">
              <div className="aspect-[3/4] h-full w-full">
                <FeaturedProductCard
                  product={product}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                  quantity={cart[product.name]?.quantity || 0}
                  isLiked={!!likedProducts[product._id]}
                  onLikeToggle={onLikeToggle}
                  isMobile={isMobile}
                />
              </div>
            </div>
          ))}
          <div className="w-40 flex-shrink-0">
            <div className="flex aspect-[3/4] h-full w-full">
              <Button
                variant="outline"
                onClick={handleViewMore}
                className="w-full h-full bg-white/20 border-2 border-dashed border-white/50 text-white hover:bg-white/30 hover:text-white flex flex-col items-center justify-center gap-2 rounded-2xl"
              >
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <ChevronRight className="h-8 w-8" />
                </div>
                <span className="font-semibold text-base">View More</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map(product => (
            <div key={product._id} className="aspect-[3/4]">
              <FeaturedProductCard
                product={product}
                onProductClick={onProductClick}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                quantity={cart[product.name]?.quantity || 0}
                isLiked={!!likedProducts[product._id]}
                onLikeToggle={onLikeToggle}
                isMobile={isMobile}
              />
            </div>
          ))}
          <div className="flex aspect-[3/4]">
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
      )}
    </div>
  );
}
