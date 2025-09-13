
// src/app/search/page.tsx

import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import SearchClientPage from '@/components/views/SearchClientPage'; // We'll create this next
import type { SanityProduct, StructuredFilter } from '@/types';
import Image from 'next/image';
import { Loader } from '@/components/loader';

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

function formatCategoryTitleToKey(title: string) {
    return title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}

// Fetches products from Sanity based on URL filters
async function getFilteredProducts(searchParams: { [key: string]: string | string[] | undefined }, allFilters: StructuredFilter[]): Promise<SanityProduct[]> {
    const filters: string[] = [];
    const params: { [key: string]: any } = {};
    const queryTerm = searchParams.q as string;

    if (queryTerm) {
        filters.push(`(name match $queryTerm || tags[] match $queryTerm)`);
        params.queryTerm = `*${queryTerm}*`;
    }

    // Add price filter
    const minPrice = searchParams.minPrice;
    const maxPrice = searchParams.maxPrice;
    if (minPrice) {
        filters.push(`discountedPrice >= $minPrice`);
        params.minPrice = Number(minPrice);
    }
    if (maxPrice) {
        filters.push(`discountedPrice <= $maxPrice`);
        params.maxPrice = Number(maxPrice);
    }

    // Handle dynamic filters from Sanity
    allFilters.forEach(category => {
        const categoryKey = formatCategoryTitleToKey(category.title);
        const urlValues = searchParams[categoryKey];

        if (urlValues && Array.isArray(urlValues) && urlValues.length > 0) {
            if (category.title === 'Flavours & Fillings') {
                const paramName = `flavourList_${categoryKey.replace(/-/g, '_')}`;
                filters.push(`count((availableFlavours[]->name)[@ in $${paramName}]) > 0`);
                params[paramName] = urlValues;
            } else {
                const paramName = `filterList_${categoryKey.replace(/-/g, '_')}`;
                filters.push(`count((filterOptions[]->title)[@ in $${paramName}]) > 0`);
                params[paramName] = urlValues;
            }
        } else if (urlValues && !Array.isArray(urlValues)) {
            const filterValues = [urlValues];
             if (category.title === 'Flavours & Fillings') {
                const paramName = `flavourList_${categoryKey.replace(/-/g, '_')}`;
                filters.push(`count((availableFlavours[]->name)[@ in $${paramName}]) > 0`);
                params[paramName] = filterValues;
            } else {
                const paramName = `filterList_${categoryKey.replace(/-/g, '_')}`;
                filters.push(`count((filterOptions[]->title)[@ in $${paramName}]) > 0`);
                params[paramName] = filterValues;
            }
        }
    });

    const filterClause = filters.length > 0 ? `&& ${filters.join(' && ')}` : '';
    const productQuery = `*[_type == "product" ${filterClause}]{
        _id, name, slug, mrp, discountedPrice, weight, packageType, composition, "images": images[].asset->url, "filterOptions": filterOptions[]->{title, "category": category->title},
        availableFlavours[]->{
            _id,
            name,
            "imageUrl": image.asset->url
        }
    }`;
    
    try {
        const products = await client.fetch(productQuery, params);
        return products;
    } catch (error) {
        console.error("Failed to fetch filtered products:", error);
        return [];
    }
}

const LoadingFallback = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-background gap-4">
        <Loader />
        <p className="text-lg">Loading your chocolates...</p>
    </div>
);


// The new Server Component page
export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const filters = await getFilters();
    const products = await getFilteredProducts(searchParams, filters);

    return (
        <Suspense fallback={<LoadingFallback />}>
            <SearchClientPage initialProducts={products} initialFilters={filters} />
        </Suspense>
    );
}
