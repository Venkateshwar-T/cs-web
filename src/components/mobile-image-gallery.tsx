
// @/components/mobile-image-gallery.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Expand, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { productImages } from '@/lib/images';
import type { Product } from '@/app/page';

interface MobileImageGalleryProps {
    product: Product;
    onImageExpandChange: (isExpanded: boolean) => void;
}

export function MobileImageGallery({ product, onImageExpandChange }: MobileImageGalleryProps) {
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
            <div className="flex flex-col items-center gap-2 p-4">
                
                {/* Main Image */}
                <div className="group relative w-5/6 aspect-square">
                    <Image
                        src={productImages[activeIndex].src}
                        alt={productImages[activeIndex].alt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                        data-ai-hint={productImages[activeIndex].hint}
                        onDragStart={(e) => e.preventDefault()}
                    />
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
                <div className="grid grid-cols-4 gap-2 w-5/6">
                    {productImages.map((image, index) => (
                        <button
                            key={image.id} 
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative w-full aspect-square transition-all duration-200 rounded-md overflow-hidden ring-2 ring-offset-2 ring-offset-[#9A7DAB]",
                                activeIndex === index ? 'ring-white' : 'ring-transparent hover:ring-white/50'
                            )}
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
            {isExpanded && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-fade-in" style={{animationDuration: '0.3s'}}>
                    <div className="relative w-[90vw] h-auto">
                        <Image
                            src={productImages[activeIndex].src}
                            alt={productImages[activeIndex].alt}
                            width={1200}
                            height={1200}
                            className="object-contain w-full h-full rounded-lg"
                            data-ai-hint={productImages[activeIndex].hint}
                            onDragStart={(e) => e.preventDefault()}
                        />
                         <button 
                            onClick={handleCloseExpanded} 
                            className="absolute -top-2 -right-2 text-white bg-black/50 p-1.5 rounded-full hover:bg-black/70 transition-colors"
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
