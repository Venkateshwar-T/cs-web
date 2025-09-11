
// @/components/filter-container.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterControls } from './filter-controls';
import type { StructuredFilter } from '@/types';
import { useCallback } from 'react';

interface FilterContainerProps {
    filters: StructuredFilter[];
    isMobile?: boolean;
}

export function FilterContainer({ filters, isMobile = false }: FilterContainerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

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

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);
    
    const handlePriceRangeChange = useCallback((range: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('minPrice', range[0].toString());
        params.set('maxPrice', range[1].toString());
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handlePriceCheckboxChange = useCallback((range: [number, number] | null, isChecked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (isChecked && range) {
            params.set('minPrice', range[0].toString());
            params.set('maxPrice', range[1].toString());
        } else {
            // If a checkbox is unchecked, we can remove the price filters 
            // to revert to the slider's state or a default state.
            params.delete('minPrice');
            params.delete('maxPrice');
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    return (
        <FilterControls 
            structuredFilters={filters}
            isMobile={isMobile}
            searchParams={searchParams}
            onFilterChange={handleFilterChange}
            onPriceRangeChange={handlePriceRangeChange}
            onPriceCheckboxChange={handlePriceCheckboxChange}
        />
    );
}
