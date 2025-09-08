// @/components/featured-products.tsx
'use client';

import { ProductCard } from './product-card';
import { SectionTitle } from './section-title';
import type { Product } from '@/app/page';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FeaturedProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
  likedProducts: Record<number, boolean>;
  onLikeToggle: (productId: number) => void;
  isMobile?: boolean;
}

export function FeaturedProducts({
  products,
  onProductClick,
  onAddToCart,
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
      "bg-[#9A7DAB] rounded-[40px] ring-4 ring-custom-purple-dark px-4 sm:px-6 lg:px-8",
      isMobile ? "py-4" : "py-8"
    )}>
      <SectionTitle className={cn(
        "mb-4 px-4 md:px-0 text-white",
        isMobile ? "text-base" : "text-xl md:text-2xl"
      )}>
        You might also like
      </SectionTitle>
      <div className="flex items-stretch overflow-x-auto no-scrollbar gap-4 md:gap-6 px-4 pt-2 pb-2">
        {products.map(product => (
          <div key={product.id} className={cn("flex-shrink-0", isMobile ? "w-40" : "w-48 md:w-56")}>
            <ProductCard
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              quantity={cart[product.name] || 0}
              isLiked={!!likedProducts[product.id]}
              onLikeToggle={() => onLikeToggle(product.id)}
              isMobile={isMobile}
            />
          </div>
        ))}
        <div className={cn("flex-shrink-0 flex", isMobile ? "w-40" : "w-48 md:w-56")}>
           <Button
            variant="outline"
            onClick={handleViewMore}
            className="w-full h-full bg-white/20 border-2 border-dashed border-white/50 text-white hover:bg-white/30 hover:text-white flex flex-col items-center justify-center gap-2 rounded-2xl"
          >
            <div className={cn(
              "rounded-full bg-white/20 flex items-center justify-center",
              isMobile ? "h-12 w-12" : "h-16 w-16"
            )}>
                <ChevronRight className={cn(isMobile ? "h-8 w-8" : "h-10 w-10")} />
            </div>
            <span className={cn("font-semibold", isMobile ? "text-base" : "text-lg")}>View More</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
