
// @/app/page.tsx
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import { Suspense } from 'react';
import { Loader } from '@/components/loader';
import HomeClient from './home-client';


async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{ ..., "images": images[].asset->url, availableFlavours[]->{ _id, name, "imageUrl": image.asset->url, "price": coalesce(price, 0) }, numberOfChocolates }`;
    const products = await client.fetch(query);
    return products;
}

const LoadingFallback = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader />
    </div>
);


export default async function Home() {
    const allProducts = await getAllProducts();
    return (
        <Suspense fallback={<LoadingFallback />}>
            <HomeClient allProducts={allProducts} />
        </Suspense>
    );
}

