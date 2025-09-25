
// @/app/page.tsx
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import { Suspense } from 'react';
import HomeClient from './home-client';
import { LoadingFallback } from '@/components/loading-fallback';

export type ActiveView = 'home' | 'search' | 'cart' | 'profile' | 'about' | 'faq' | 'order-confirmed' | 'product-detail' | 'admin';

interface HomepageContent {
  exploreCategories: { _key: string; name: string; imageUrl: string }[];
  exploreFlavours: { _key: string; name: string; imageUrl: string }[];
}

async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{ ..., "images": images[].asset->url, availableFlavours[]->{ _id, name, "imageUrl": image.asset->url, "price": coalesce(price, 0) }, numberOfChocolates }`;
    const products = await client.fetch(query);
    return products;
}

async function getHomepageContent(): Promise<HomepageContent> {
    const query = `*[_type == "homepage"][0]{
        exploreCategories[]{
            _key,
            name,
            "imageUrl": image.asset->url
        },
        exploreFlavours[]{
            _key,
            name,
            "imageUrl": image.asset->url
        }
    }`;
    const content = await client.fetch(query);
    return content || { exploreCategories: [], exploreFlavours: [] };
}

export default async function Home() {
    const allProducts = await getAllProducts();
    const homepageContent = await getHomepageContent();

    return (
        <Suspense fallback={<LoadingFallback text="Welcome to ChocoSmiley..." />}>
            <HomeClient
                allProducts={allProducts}
                exploreCategories={homepageContent.exploreCategories}
                exploreFlavours={homepageContent.exploreFlavours}
            />
        </Suspense>
    );
}
