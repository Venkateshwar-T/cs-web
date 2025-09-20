
// @/app/cart/page.tsx

import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import { Loader } from '@/components/loader';
import CartClientPage from './cart-client-page';
import Image from 'next/image';

async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{
        _id, name, slug, mrp, discountedPrice, weight, packageType, composition, "images": images[].asset->url, "filterOptions": filterOptions[]->{title, "category": category->title},
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

const LoadingFallback = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Image src="/Choco Smiley Logo.png" alt="Choco Smiley" width={180} height={70} />
            <Loader />
        </div>
    </div>
);

export default async function CartPage() {
    const allProducts = await getAllProducts();

    return (
        <Suspense fallback={<LoadingFallback />}>
            <CartClientPage allProducts={allProducts} />
        </Suspense>
    );
}
