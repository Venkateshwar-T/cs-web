// @/components/filter-container.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterControls } from './filter-controls';
import type { StructuredFilter } from '@/types';
import { useCallback, useState, useEffect } from 'react';

interface FilterContainerProps {
    filters: StructuredFilter[];
    isMobile?: boolean;
}

function formatCategoryTitleToKey(title: string) {
    return title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}

export function FilterContainer({ filters, isMobile = false }: FilterContainerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state to hold the current selections for instant UI feedback
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    // Sync local state with URL search params when they change
    useEffect(() => {
        const newSelectedFilters: Record<string, string[]> = {};
        filters.forEach(category => {
            const categoryKey = formatCategoryTitleToKey(category.title);
            const values = searchParams.getAll(categoryKey);
            if (values.length > 0) {
                newSelectedFilters[categoryKey] = values;
            }
        });
        setSelectedFilters(newSelectedFilters);
    }, [searchParams, filters]);

    const handleFilterChange = useCallback((categoryKey: string, optionTitle: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        
        const existingValues = params.getAll(categoryKey);

        if (checked) {
            if (!existingValues.includes(optionTitle)) {
                params.append(categoryKey, optionTitle);
            }
        } else {
            const newValues = existingValues.filter(v => v !== optionTitle);
            params.delete(categoryKey);
            newValues.forEach(v => params.append(categoryKey, v));
        }

        // Optimistically update local state for instant UI feedback
        setSelectedFilters(prev => {
            const newValues = checked 
                ? [...(prev[categoryKey] || []), optionTitle]
                : (prev[categoryKey] || []).filter(v => v !== optionTitle);
            
            const newState = { ...prev };
            if (newValues.length > 0) {
                newState[categoryKey] = newValues;
            } else {
                delete newState[categoryKey];
            }
            return newState;
        });

        // Update URL in the background
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);
    
    const handlePriceRangeChange = useCallback((range: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('priceRange'); // Clear checkbox selections
        params.set('minPrice', range[0].toString());
        params.set('maxPrice', range[1].toString());
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handlePriceCheckboxChange = useCallback((rangeString: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        // Clear slider selections
        params.delete('minPrice');
        params.delete('maxPrice');
        
        const existingRanges = params.getAll('priceRange');
        if (isChecked) {
            if (!existingRanges.includes(rangeString)) {
                params.append('priceRange', rangeString);
            }
        } else {
            const newRanges = existingRanges.filter(r => r !== rangeString);
            params.delete('priceRange');
            newRanges.forEach(r => params.append('priceRange', r));
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    return (
        <FilterControls 
            structuredFilters={filters}
            isMobile={isMobile}
            searchParams={searchParams}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            onPriceCheckboxChange={handlePriceCheckboxChange}
        />
    );
}
