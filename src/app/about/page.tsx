
// @/app/about/page.tsx

import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import { Loader } from '@/components/loader';
import AboutPageClient from './about-client';

async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{ ..., "images": images[].asset->url, availableFlavours[]->{ _id, name, "imageUrl": image.asset->url } }`;
    const products = await client.fetch(query);
    return products;
}

const LoadingFallback = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader />
    </div>
);

export default async function AboutPage() {
    const allProducts = await getAllProducts();

    return (
        <Suspense fallback={<LoadingFallback />}>
            <AboutPageClient allProducts={allProducts} />
        </Suspense>
    );
}
