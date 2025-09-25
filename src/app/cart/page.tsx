
// @/app/cart/page.tsx

import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import CartClientPage from './cart-client-page';
import { LoadingFallback } from '@/components/loading-fallback';

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

export default async function CartPage() {
    const allProducts = await getAllProducts();

    return (
        <Suspense fallback={<LoadingFallback text="Loading Your Cart..." />}>
            <CartClientPage allProducts={allProducts} />
        </Suspense>
    );
}
