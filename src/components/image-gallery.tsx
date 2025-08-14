// @/components/image-gallery.tsx
'use client';

import Image from 'next/image';
import type { Product } from '@/app/page';

interface ImageGalleryProps {
    product: Product;
}

export function ImageGallery({ product }: ImageGalleryProps) {
    return (
        <div className="grid grid-cols-5 gap-6 h-full">
            
            {/* Main Image */}
            <div className="col-span-4 animate-slide-in-from-left" style={{ animationDuration: '0.5s' }}>
                <div className="relative h-full w-full aspect-square">
                    <Image
                        src="https://placehold.co/600x600.png"
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                        data-ai-hint="chocolate box"
                    />
                </div>
            </div>

            {/* Thumbnails */}
            <div className="col-span-1 flex flex-col justify-center">
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div 
                            key={index} 
                            className="relative w-full aspect-square animate-fade-in"
                            style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'both' }}
                        >
                            <Image
                                src="https://placehold.co/200x200.png"
                                alt={`Thumbnail ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-md"
                                data-ai-hint="chocolate"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
