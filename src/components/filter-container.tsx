// @/components/filter-container.tsx
'use client';

import type { FilterState } from '@/app/page';
import { FilterControls } from './filter-controls';

interface FilterContainerProps {
    filters: FilterState;
    onFilterChange: (newFilters: Partial<FilterState>) => void;
    isMobile?: boolean;
}

export function FilterContainer({ filters, onFilterChange, isMobile = false }: FilterContainerProps) {

  const handlePriceOptionChange = (optionId: string, checked: boolean) => {
    const newSelected = checked
      ? [...filters.selectedPriceOptions, optionId]
      : filters.selectedPriceOptions.filter(id => id !== optionId);
    onFilterChange({ selectedPriceOptions: newSelected });
  };
  
  const handleSliderChange = (value: [number, number]) => {
    onFilterChange({ priceRange: value, selectedPriceOptions: [] });
  };

  const createHandler = (filterKey: keyof FilterState) => (id: string, checked: boolean) => {
    const currentValues = filters[filterKey];
    if (Array.isArray(currentValues)) {
        const newValues = checked
            ? [...currentValues, id]
            : currentValues.filter(val => val !== id);
        onFilterChange({ [filterKey]: newValues } as Partial<FilterState>);
    }
  };

  const handleFlavourChange = createHandler('selectedFlavours');
  const handleOccasionChange = createHandler('selectedOccasions');
  const handleProductTypeChange = createHandler('selectedProductTypes');
  const handleWeightChange = createHandler('selectedWeights');

  return (
    <FilterControls 
        filters={filters}
        onPriceOptionChange={handlePriceOptionChange}
        onSliderChange={handleSliderChange}
        onFlavourChange={handleFlavourChange}
        onOccasionChange={handleOccasionChange}
        onProductTypeChange={handleProductTypeChange}
        onWeightChange={handleWeightChange}
        isMobile={isMobile}
    />
  );
}
