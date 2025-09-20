// @/app/faq/page.tsx (The new file)

import { Suspense } from 'react';
import { FaqContent } from '@/components/faq-content';
import FaqPageClient from './faq-client-page'; // Import the client shell
import { client } from '@/lib/sanity';
import type { SanityProduct } from '@/types';

async function getAllProducts(): Promise<SanityProduct[]> {
    const query = `*[_type == "product"]{ ..., "images": images[].asset->url, availableFlavours[]->{ _id, name, "imageUrl": image.asset->url, "price": coalesce(price, 0) }, numberOfChocolates }`;
    const products = await client.fetch(query);
    return products;
}

export default async function FaqPage() {
  const allProducts = await getAllProducts();
  return (
    // The Client Component wraps the Suspense and Server Component
    <FaqPageClient allProducts={allProducts}> 
      <Suspense fallback={<div className="flex-grow flex items-center justify-center"><p className="text-white text-center">Loading FAQs...</p></div>}>
        <FaqContent />
      </Suspense>
    </FaqPageClient>
  );
}
