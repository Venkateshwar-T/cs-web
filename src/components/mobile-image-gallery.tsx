// @/components/mobile-image-gallery.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Expand, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SanityProduct } from '@/types';

interface MobileImageGalleryProps {
    product: SanityProduct;
    onImageExpandChange: (isExpanded: boolean) => void;
}

export function MobileImageGallery({ product, onImageExpandChange }: MobileImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const images = product.images || [];

    const handleExpandClick = () => {
        setIsExpanded(true);
        onImageExpandChange(true);
    };

    const handleCloseExpanded = () => {
        setIsExpanded(false);
        onImageExpandChange(false);
    };
    
    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <>
            <div className="flex flex-col items-center gap-2 p-4">
                
                {/* Main Image */}
                <div className="relative w-4/5 aspect-square cursor-pointer" onClick={handleExpandClick}>
                    <Image
                        src={images.length > 0 ? images[activeIndex] : '/placeholder.png'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="rounded-xl object-cover"
                        onDragStart={(e) => e.preventDefault()}
                    />
                    
                    {images.length > 1 && (
                        <>
                             <button
                                onClick={handlePrev}
                                className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                                aria-label="Next image"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2 w-2/3">
                    {images.map((image, index) => (
                        <button
                            key={image} 
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative w-full aspect-square transition-all duration-200 rounded-md overflow-hidden ring-2 ring-offset-2 ring-offset-[#9A7DAB]",
                                activeIndex === index ? 'ring-custom-gold' : 'ring-transparent hover:ring-white/50'
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="rounded-md object-cover"
                                onDragStart={(e) => e.preventDefault()}
                            />
                        </button>
                    ))}
                </div>
            </div>
            {isExpanded && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-fade-in" style={{animationDuration: '0.3s'}}>
                    <div className="relative w-[90vw] h-auto">
                        <Image
                            src={images.length > 0 ? images[activeIndex] : '/placeholder.png'}
                            alt={product.name}
                            width={1200}
                            height={1200}
                            className="object-contain w-full h-full rounded-lg"
                            onDragStart={(e) => e.preventDefault()}
                        />
                         <button 
                            onClick={handleCloseExpanded} 
                            className="absolute -top-2 -right-2 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70 transition-colors"
                            aria-label="Close expanded image"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

    



