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
}

function formatCategoryTitleToKey(title: string) {
    return title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
}


export function FilterControls({ 
    structuredFilters, 
    isMobile = false,
    searchParams,
    onFilterChange,
}: FilterControlsProps) {
    // Add a price range filter for demonstration if not provided by Sanity
    const priceFilter = {
        _id: 'price',
        title: 'Price',
        options: [
            { _id: '0-500', title: 'Under ₹500' },
            { _id: '500-1000', title: '₹500 - ₹1000' },
            { _id: '1000-1500', title: '₹1000 - ₹1500' },
            { _id: '1500-2000', title: '₹1500 - ₹2000' },
            { _id: '2000-9999', title: 'Above ₹2000' },
        ]
    };
    
    const allFilters = [priceFilter, ...structuredFilters];

    // Dummy slider state - this would need to be managed via state and URL params in a real implementation
    const priceRange: [number, number] = [0, 3000];

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
                        {/* Price Slider - shown only for non-price filters */}
                        <div className="space-y-2">
                            <p className="text-sm text-white/80 font-poppins">Price</p>
                            <p className="text-base text-white font-semibold font-plex-sans">
                                ₹{priceRange[0]} - ₹{priceRange[1]}
                            </p>
                            <Slider
                                defaultValue={priceRange}
                                max={5000}
                                step={100}
                                className="w-full"
                            />
                        </div>
                        
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
