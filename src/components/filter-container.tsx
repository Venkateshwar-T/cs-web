
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

    // Local state for instant UI feedback on Sanity filters
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    // Local state for instant UI feedback on price checkboxes
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

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

        // Also sync price ranges for price checkboxes
        const priceRanges = searchParams.getAll('priceRange');
        setSelectedPriceRanges(priceRanges);

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

        // Optimistic UI update for price checkboxes
        setSelectedPriceRanges([]);

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handlePriceCheckboxChange = useCallback((rangeString: string, isChecked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        // Clear slider selections
        params.delete('minPrice');
        params.delete('maxPrice');
        
        const existingRanges = params.getAll('priceRange');
        
        let newRanges: string[];
        if (isChecked) {
            if (!existingRanges.includes(rangeString)) {
                newRanges = [...existingRanges, rangeString];
            } else {
                newRanges = existingRanges;
            }
        } else {
            newRanges = existingRanges.filter(r => r !== rangeString);
        }

        params.delete('priceRange');
        newRanges.forEach(r => params.append('priceRange', r));
        
        // Optimistic UI update
        setSelectedPriceRanges(newRanges);

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    return (
        <FilterControls 
            structuredFilters={filters}
            isMobile={isMobile}
            searchParams={searchParams}
            selectedFilters={selectedFilters}
            selectedPriceRanges={selectedPriceRanges}
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            onPriceCheckboxChange={handlePriceCheckboxChange}
        />
    );
}
