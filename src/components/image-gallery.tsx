// @/components/image-gallery.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Expand, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { productImages } from '@/lib/images';
import type { Product } from '@/app/page';

interface ImageGalleryProps {
    product: Product;
    onImageExpandChange: (isExpanded: boolean) => void;
}

export function ImageGallery({ product, onImageExpandChange }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpandClick = () => {
        setIsExpanded(true);
        onImageExpandChange(true);
    };

    const handleCloseExpanded = () => {
        setIsExpanded(false);
        onImageExpandChange(false);
    };

    return (
        <>
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
                            onDragStart={(e) => e.preventDefault()}
                        />
                    </div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 rounded-xl">
                        <button 
                            onClick={handleExpandClick} 
                            className="text-white p-2 rounded-full hover:bg-black/30 transition-colors"
                            aria-label="Expand image"
                        >
                            <Expand size={32} />
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
                                    activeIndex === index ? 'ring-custom-gold' : 'ring-transparent hover:ring-white/50'
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
                                    onDragStart={(e) => e.preventDefault()}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-fade-in" style={{animationDuration: '0.3s'}}>
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <Image
                            src={productImages[activeIndex].src}
                            alt={productImages[activeIndex].alt}
                            width={1200}
                            height={1200}
                            className="object-contain max-h-[90vh] w-auto"
                            data-ai-hint={productImages[activeIndex].hint}
                            onDragStart={(e) => e.preventDefault()}
                        />
                         <button 
                            onClick={handleCloseExpanded} 
                            className="absolute -top-4 -right-4 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70 transition-colors"
                            aria-label="Close expanded image"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
