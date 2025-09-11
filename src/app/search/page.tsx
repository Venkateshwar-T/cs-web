
// src/app/search/page.tsx

import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import SearchClientPage from '@/components/views/SearchClientPage'; // We'll create this next
import type { SanityProduct, StructuredFilter } from '@/types';
import Image from 'next/image';

// Fetches filters from Sanity
async function getFilters(): Promise<StructuredFilter[]> {
    const query = `{
        "categories": *[_type == "filterCategory"]{_id, title, "icon": icon.asset->url},
        "options": *[_type == "filterOption"]{_id, title, "categoryId": category->_id},
        "flavours": *[_type == "flavour"]{_id, "title": name}
    }`;
    try {
        const { categories, options, flavours } = await client.fetch(query);
        return categories.map((category: any) => {
            if (category.title === 'Flavours & Fillings') {
                return { ...category, options: flavours };
            }
            return { ...category, options: options.filter((opt: any) => opt.categoryId === category._id) };
        });
    } catch (error) {
        console.error("Failed to fetch filter data:", error);
        return [];
    }
}

// Fetches products from Sanity based on URL filters
async function getFilteredProducts(searchParams: { [key: string]: string | string[] | undefined }): Promise<SanityProduct[]> {
    const filters: string[] = [];
    const params: { [key: string]: any } = {};
    const queryTerm = searchParams.q as string;

    if (queryTerm) {
        filters.push(`(name match $queryTerm || tags[] match $queryTerm)`);
        params.queryTerm = `*${queryTerm}*`;
    }

    // Add your filter logic here based on searchParams
    const flavours = searchParams['flavours-fillings'];
    if (flavours) {
        const flavourList = Array.isArray(flavours) ? flavours : [flavours];
        if (flavourList.length > 0) {
            filters.push(`count((availableFlavours[]->name)[@ in $flavourList]) > 0`);
            params.flavourList = flavourList;
        }
    }
    // Add more else-if blocks here for other filters...

    const filterClause = filters.length > 0 ? `&& ${filters.join(' && ')}` : '';
    const productQuery = `*[_type == "product" ${filterClause}]{
        _id, name, slug, mrp, discountedPrice, weight, packageType, composition, "images": images[].asset->url
    }`;
    const products = await client.fetch(productQuery, params);
    return products;
}

const LoadingFallback = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-background gap-4">
        <Image 
            src="/Choco Smiley Logo.png"
            alt="Choco Smiley Logo"
            width={200}
            height={80}
            className="w-48 animate-pulse"
        />
        <p className="text-lg">Loading your chocolates...</p>
    </div>
);


// The new Server Component page
export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const products = await getFilteredProducts(searchParams);
    const filters = await getFilters();

    return (
        <Suspense fallback={<LoadingFallback />}>
            <SearchClientPage initialProducts={products} initialFilters={filters} />
        </Suspense>
    );
}
