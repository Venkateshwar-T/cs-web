// @/components/image-gallery.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { productImages } from '@/lib/images';
import type { Product } from '@/app/page';

interface ImageGalleryProps {
    product: Product;
}

export function ImageGallery({ product }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? productImages.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === productImages.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="grid grid-cols-5 gap-6 h-full">
            
            {/* Main Image */}
            <div className="col-span-4 animate-slide-in-from-left group relative" style={{ animationDuration: '0.5s' }}>
                <div className="relative h-full w-full aspect-square">
                    <Image
                        src={productImages[activeIndex].src}
                        alt={productImages[activeIndex].alt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                        data-ai-hint={productImages[activeIndex].hint}
                    />
                </div>
                 <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={handlePrev} 
                        className="bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={handleNext} 
                        className="bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors"
                        aria-label="Next image"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="col-span-1 flex flex-col justify-center">
                <div className="flex flex-col gap-3">
                    {productImages.map((image, index) => (
                        <button
                            key={image.id} 
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative w-full aspect-square animate-fade-in transition-all duration-200 rounded-md overflow-hidden ring-2 ring-offset-2 ring-offset-[#9A7DAB]",
                                activeIndex === index ? 'ring-white' : 'ring-transparent hover:ring-white/50'
                            )}
                            style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'both' }}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-md"
                                data-ai-hint={image.hint}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
