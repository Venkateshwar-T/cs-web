// @/components/image-gallery.tsx
'use client';

import Image from 'next/image';
import type { Product } from '@/app/page';

interface ImageGalleryProps {
    product: Product;
}

export function ImageGallery({ product }: ImageGalleryProps) {
    return (
        // MODIFIED: Changed from a 6-column to a 4-column grid for a more compact layout.
        <div className="grid grid-cols-4 gap-2">
            
            {/* Main Image */}
            {/* MODIFIED: The main image now takes 3 of 4 columns instead of 5 of 6. This is the key change to reduce its size. */}
            <div className="col-span-3">
                <div className="relative w-full aspect-square">
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
            {/* The thumbnail column now takes up 1 of 4 columns. */}
            <div className="col-span-1 flex flex-col justify-center">
                <div className="flex flex-col gap-1">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="relative w-full aspect-square">
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