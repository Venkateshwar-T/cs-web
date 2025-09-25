
// @/app/product/[slug]/page.tsx
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import { notFound } from 'next/navigation';
import ProductDetailClientPage from '@/components/views/ProductDetailClientPage';
import { Suspense } from 'react';
import { LoadingFallback } from '@/components/loading-fallback';

async function getProduct(slug: string): Promise<SanityProduct | null> {
    const query = `*[_type == "product" && slug.current == $slug][0]{
        ...,
        "images": images[].asset->url,
        availableFlavours[]->{
            _id,
            name,
            "imageUrl": image.asset->url,
            "price": coalesce(price, 0)
        },
        numberOfChocolates
    }`;
    const product = await client.fetch(query, { slug });
    return product;
}

async function getFeaturedProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"] | order(_createdAt desc)[0...4]{
        _id,
        name,
        slug,
        mrp,
        discountedPrice,
        weight,
        packageType,
        composition,
        "images": images[].asset->url,
        availableFlavours[]->{
            _id,
            name,
            "imageUrl": image.asset->url,
            "price": coalesce(price, 0)
        },
        numberOfChocolates
    }`;
    const products = await client.fetch(query);
    return products;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);
    const featuredProducts = await getFeaturedProducts();

    if (!product) {
        notFound();
    }

    return (
        <Suspense fallback={<LoadingFallback text="Loading your Chocolate..." />}>
            <ProductDetailClientPage product={product} featuredProducts={featuredProducts} />
        </Suspense>
    );
}
