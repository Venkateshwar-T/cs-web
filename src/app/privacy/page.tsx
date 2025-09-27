// @/app/privacy/page.tsx
import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import PrivacyPageClient from './privacy-client';
import { PrivacyContent } from './privacy-content';
import { LoadingFallback } from '@/components/loading-fallback';

async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{ ..., "images": images[].asset->url, availableFlavours[]->{ _id, name, "imageUrl": image.asset->url, "price": coalesce(price, 0) }, numberOfChocolates }`;
    const products = await client.fetch(query);
    return products;
}

export default async function PrivacyPage() {
    const allProducts = await getAllProducts();

    return (
        <PrivacyPageClient allProducts={allProducts}>
            <Suspense fallback={<LoadingFallback text="Loading Privacy Policy..." />}>
                <PrivacyContent />
            </Suspense>
        </PrivacyPageClient>
    );
}
