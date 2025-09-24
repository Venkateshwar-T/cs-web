

// src/app/search/page.tsx

import { Suspense } from 'react';
import { client } from '@/lib/sanity';
import SearchClientPage from '@/components/views/SearchClientPage';
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

// Fetches products from Sanity based on URL filters and sorting
async function getFilteredProducts(searchParams: { [key: string]: string | string[] | undefined }, allFilters: StructuredFilter[]): Promise<SanityProduct[]> {
    const filters: string[] = [];
    const params: { [key: string]: any } = {};
    const queryTerm = searchParams.q as string;
    const sortOption = searchParams.sort as string;

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
    
    let sortClause = '';
    switch (sortOption) {
        case 'price-low-to-high':
            sortClause = 'order(discountedPrice asc)';
            break;
        case 'price-high-to-low':
            sortClause = 'order(discountedPrice desc)';
            break;
        case 'new-arrivals':
            sortClause = 'order(_createdAt desc)';
            break;
        case 'featured':
        default:
            sortClause = 'order(_createdAt desc)'; // Default to new arrivals for featured
            break;
    }

    const productQuery = `*[_type == "product" ${filterClause}] | ${sortClause}{
        _id, name, slug, mrp, discountedPrice, weight, packageType, composition, "images": images[].asset->url, "filterOptions": filterOptions[]->{title, "category": category->title},
        availableFlavours[]->{
            _id,
            name,
            "imageUrl": image.asset->url,
            "price": coalesce(price, 0)
        },
        numberOfChocolates
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
    <div className="flex h-screen w-full items-center justify-center bg-background flex-col gap-4">
        <div className="flex flex-col items-center gap-4">
            <Image src="/Choco Smiley Logo.png" alt="Choco Smiley" width={180} height={70} />
            <Loader />
        </div>
        <p className="text-white">Loading your chocolates...</p>
    </div>
);


export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const filters = await getFilters();
    const products = await getFilteredProducts(searchParams, filters);

    return (
        <Suspense fallback={<LoadingFallback />}>
            <SearchClientPage initialProducts={products} initialFilters={filters} />
        </Suspense>
    );
}
