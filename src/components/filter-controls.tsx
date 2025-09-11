
// @/components/filter-controls.tsx
'use client';

import { cn } from "@/lib/utils";
import { SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { StructuredFilter } from "@/types";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const FilterSection = ({ title, icon, children }: { title: string, icon?: React.ReactNode, children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
        {icon && <div className="w-5 h-5 flex items-center justify-center">{icon}</div>}
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
        className="border-white/50"
      />
      <Label htmlFor={id} className="text-white font-plex-sans text-sm flex-grow">
        {label}
      </Label>
      {count !== undefined && <span className="text-white/70 text-xs font-plex-sans">({count})</span>}
    </div>
);

interface FilterControlsProps {
    structuredFilters: StructuredFilter[];
    isMobile?: boolean;
    searchParams: ReadonlyURLSearchParams;
    onFilterChange: (categoryKey: string, optionTitle: string, checked: boolean) => void;
    onPriceRangeChange: (range: [number, number]) => void;
    onPriceCheckboxChange: (range: [number, number] | null, checked: boolean) => void;
}

function formatCategoryTitleToKey(title: string) {
    return title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}

const priceOptions = [
    { id: '0-500', title: 'Under ₹500', range: [0, 500] },
    { id: '500-1000', title: '₹500 - ₹1000', range: [500, 1000] },
    { id: '1000-1500', title: '₹1000 - ₹1500', range: [1000, 1500] },
    { id: '1500-2000', title: '₹1500 - ₹2000', range: [1500, 2000] },
    { id: '2000-9999', title: 'Above ₹2000', range: [2000, 9999] },
];


export function FilterControls({ 
    structuredFilters, 
    isMobile = false,
    searchParams,
    onFilterChange,
    onPriceRangeChange,
    onPriceCheckboxChange
}: FilterControlsProps) {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    const [sliderValue, setSliderValue] = useState<[number, number]>([
        minPrice ? Number(minPrice) : 0,
        maxPrice ? Number(maxPrice) : 3000
    ]);

    const [activeCheckbox, setActiveCheckbox] = useState<string | null>(null);

    useEffect(() => {
        const min = minPrice ? Number(minPrice) : 0;
        const max = maxPrice ? Number(maxPrice) : 3000;
        setSliderValue([min, max]);

        // Check if the current slider values match a checkbox option
        const matchingOption = priceOptions.find(opt => opt.range[0] === min && opt.range[1] === max);
        if (matchingOption) {
            setActiveCheckbox(matchingOption.id);
        } else {
            setActiveCheckbox(null);
        }
    }, [minPrice, maxPrice]);

    const handleSliderCommit = (value: [number, number]) => {
        onPriceRangeChange(value);
    };

    const handleCheckboxChange = (optionId: string, range: [number, number], isChecked: boolean) => {
        if (isChecked) {
            setActiveCheckbox(optionId);
            onPriceCheckboxChange(range, true);
        } else {
            setActiveCheckbox(null);
            onPriceCheckboxChange(null, false);
        }
    };

    const allFilters = structuredFilters;

    const containerClasses = isMobile 
        ? "h-[75vh] flex flex-col" 
        : cn("bg-custom-gray-dark shadow-custom-dark h-full w-full rounded-tr-[40px] animate-slide-in-from-left");
    
    const innerContainerClasses = isMobile
        ? "flex-grow overflow-y-auto custom-scrollbar px-6 py-4"
        : "bg-white/20 h-full w-full rounded-tr-[40px] md:pt-2 md:pl-3 lg:pt-4 lg:pl-4 xl:pt-8 xl:pl-8";
    
    const contentClasses = isMobile 
        ? "space-y-6"
        : "h-full overflow-y-auto custom-scrollbar pr-8 pb-8";

    return (
        <div className={containerClasses} style={!isMobile ? { animationDuration: '0.5s' } : {}}>
            <div className={innerContainerClasses}>
                <div className={contentClasses}>
                    {!isMobile && (
                        <div className="flex items-center text-white font-bold mb-6 text-lg">
                            <SlidersHorizontal className="lg:h-5 lg:w-5 xl:h-6 xl:w-6 mr-3 flex-shrink-0" />
                            <h2 className="h-full w-full font-poppins">Filters & Sorting</h2>
                        </div>
                    )}
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-sm text-white/80 font-poppins">Price</p>
                            <p className="text-base text-white font-semibold font-plex-sans">
                                ₹{sliderValue[0]} - ₹{sliderValue[1]}
                            </p>
                            <Slider
                                value={sliderValue}
                                onValueChange={setSliderValue}
                                onValueCommit={handleSliderCommit}
                                max={3000}
                                step={100}
                                className="w-full"
                            />
                        </div>

                         <FilterSection title="Price Range">
                            {priceOptions.map((option) => (
                                <CheckboxItem
                                    key={option.id}
                                    id={`${isMobile ? 'mobile-' : ''}${option.id}`}
                                    label={option.title}
                                    checked={activeCheckbox === option.id}
                                    onCheckedChange={(checked) => handleCheckboxChange(option.id, option.range as [number, number], !!checked)}
                                />
                            ))}
                        </FilterSection>
                        
                        {allFilters.map((filterCategory) => {
                            const categoryKey = formatCategoryTitleToKey(filterCategory.title);
                            return (
                                <FilterSection
                                    key={filterCategory._id}
                                    title={filterCategory.title}
                                    icon={filterCategory.icon ? <Image src={filterCategory.icon} alt={filterCategory.title} width={18} height={18} /> : undefined}
                                >
                                    {filterCategory.options.map((option) => {
                                        const isChecked = (searchParams.getAll(categoryKey) || []).includes(option.title);
                                        return (
                                            <CheckboxItem
                                                key={option._id}
                                                id={`${isMobile ? 'mobile-' : ''}${option._id}`}
                                                label={option.title}
                                                checked={isChecked}
                                                onCheckedChange={(checked) => onFilterChange(categoryKey, option.title, !!checked)}
                                            />
                                        )
                                    })}
                                </FilterSection>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
