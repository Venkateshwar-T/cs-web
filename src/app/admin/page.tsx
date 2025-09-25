
// @/app/admin/page.tsx
import { Suspense } from 'react';
import AdminClientPage from './admin-client-page';
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import { LoadingFallback } from '@/components/loading-fallback';

async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{ ..., "images": images[].asset->url, availableFlavours[]->{ _id, name, "imageUrl": image.asset->url, "price": coalesce(price, 0) }, numberOfChocolates }`;
    const products = await client.fetch(query);
    return products;
}

export default async function AdminPage() {
    const allProducts = await getAllProducts();
    return (
        <Suspense fallback={<LoadingFallback text="Loading Admin Panel..." />}>
            <AdminClientPage allProducts={allProducts} />
        </Suspense>
    );
}
