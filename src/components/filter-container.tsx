
'use client';

import { cn } from "@/lib/utils";
import { SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FilterState } from '@/app/page';
import { priceOptions, flavourOptions, occasionOptions, productTypeOptions, weightOptions } from '@/lib/filter-options';
import { useRef, useEffect } from "react";


const FilterSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-base text-white font-bold font-plex-sans-condensed">{title}</h3>
    </div>
    <div className="space-y-2 pl-0">{children}</div>
  </div>
);

const CheckboxItem = ({ id, label, checked, onCheckedChange, count }: { id: string, label: string, checked: boolean, onCheckedChange: (checked: boolean) => void, count?: number }) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id} className="text-white font-plex-sans text-sm flex-grow">
        {label}
      </Label>
      {count !== undefined && <span className="text-white/70 text-xs font-plex-sans">({count})</span>}
    </div>
);

interface FilterContainerProps {
    filters: FilterState;
    onFilterChange: (newFilters: Partial<FilterState>) => void;
    isSearching: boolean;
}

export function FilterContainer({ filters, onFilterChange, isSearching }: FilterContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearching && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isSearching]);

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
    <div className={cn("bg-custom-gray-dark h-full w-[17%] rounded-tr-[40px] animate-slide-in-from-left")} style={{ animationDuration: '0.5s' }}>
        <div className="bg-white/20 h-full w-full rounded-tr-[40px] md:pt-2 md:pl-3 lg:pt-4 lg:pl-4 xl:pt-8 xl:pl-8">
            <div ref={scrollContainerRef} className="h-full overflow-y-auto custom-scrollbar pr-8 pb-8">
                <div className="flex items-center text-white font-bold mb-6 text-lg">
                    <SlidersHorizontal className="lg:h-5 lg:w-5 xl:h-6 xl:w-6 mr-3 flex-shrink-0" />
                    <h2 className="h-full w-full font-poppins">Filters & Sorting</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm text-white/80 font-poppins">Price</p>
                    <p className="text-base text-white font-semibold font-plex-sans">
                      ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                    </p>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={handleSliderChange}
                      max={3000}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 pl-0">
                    {priceOptions.map((option) => (
                       <CheckboxItem
                          key={option.id}
                          id={option.id}
                          label={option.label}
                          checked={filters.selectedPriceOptions.includes(option.id)}
                          onCheckedChange={(checked) => handlePriceOptionChange(option.id, !!checked)}
                        />
                    ))}
                  </div>
                  
                  <FilterSection title="Flavours & Fillings" icon={<Image src="/icons/flavours_icon.png" alt="Flavours" width={18} height={18} onDragStart={(e) => e.preventDefault()}/>}>
                    {flavourOptions.map((option) => (
                      <CheckboxItem
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        checked={filters.selectedFlavours.includes(option.id)}
                        onCheckedChange={(checked) => handleFlavourChange(option.id, !!checked)}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection title="Best for Occasion" icon={<Image src="/icons/occasion_icon.png" alt="Occasion" width={18} height={18} onDragStart={(e) => e.preventDefault()}/>}>
                    {occasionOptions.map((option) => (
                      <CheckboxItem
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        count={option.count}
                        checked={filters.selectedOccasions.includes(option.id)}
                        onCheckedChange={(checked) => handleOccasionChange(option.id, !!checked)}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection title="Product Type" icon={<Image src="/icons/product_type_icon.png" alt="Product Type" width={16} height={16} onDragStart={(e) => e.preventDefault()}/>}>
                    {productTypeOptions.map((option) => (
                      <CheckboxItem
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        count={option.count}
                        checked={filters.selectedProductTypes.includes(option.id)}
                        onCheckedChange={(checked) => handleProductTypeChange(option.id, !!checked)}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection title="Weight" icon={<Image src="/icons/weight_icon.png" alt="Weight" width={14} height={14} onDragStart={(e) => e.preventDefault()}/>}>
                    {weightOptions.map((option) => (
                      <CheckboxItem
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        count={option.count}
                        checked={filters.selectedWeights.includes(option.id)}
                        onCheckedChange={(checked) => handleWeightChange(option.id, !!checked)}
                      />
                    ))}
                  </FilterSection>

                </div>
            </div>
        </div>
    </div>
  );
}
