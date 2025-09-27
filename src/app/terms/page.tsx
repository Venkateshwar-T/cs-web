// @/app/terms/page.tsx
import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import TermsPageClient from './terms-client';
import { TermsContent } from './terms-content';
import { LoadingFallback } from '@/components/loading-fallback';

async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{ ..., "images": images[].asset->url, availableFlavours[]->{ _id, name, "imageUrl": image.asset->url, "price": coalesce(price, 0) }, numberOfChocolates }`;
    const products = await client.fetch(query);
    return products;
}

export default async function TermsPage() {
    const allProducts = await getAllProducts();

    return (
        <TermsPageClient allProducts={allProducts}>
            <Suspense fallback={<LoadingFallback text="Loading Terms & Conditions..." />}>
                <TermsContent />
            </Suspense>
        </TermsPageClient>
    );
}
