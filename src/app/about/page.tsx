
// @/app/about/page.tsx

import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import AboutPageClient from './about-client';
import { LoadingFallback } from '@/components/loading-fallback';

async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{ ..., "images": images[].asset->url, availableFlavours[]->{ _id, name, "imageUrl": image.asset->url, "price": coalesce(price, 0) }, numberOfChocolates }`;
    const products = await client.fetch(query);
    return products;
}

export default async function AboutPage() {
    const allProducts = await getAllProducts();

    return (
        <Suspense fallback={<LoadingFallback text="Loading About Us..." />}>
            <AboutPageClient allProducts={allProducts} />
        </Suspense>
    );
}
