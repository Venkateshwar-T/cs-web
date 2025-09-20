
// @/app/profile/page.tsx

import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';
import { Loader } from '@/components/loader';
import ProfileClientPage from './profile-client-page';
import Image from 'next/image';

async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{ ..., "images": images[].asset->url, availableFlavours[]->{ _id, name, "imageUrl": image.asset->url, "price": coalesce(price, 0) }, numberOfChocolates }`;
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

export default async function ProfilePage() {
    const allProducts = await getAllProducts();

    return (
        <Suspense fallback={<LoadingFallback />}>
            <ProfileClientPage allProducts={allProducts} />
        </Suspense>
    );
}
