
'use client';

import { cn } from "@/lib/utils";
import { SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const FilterSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="text-base text-white font-bold font-plex-sans-condensed">{title}</h3>
    <div className="space-y-2">{children}</div>
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
      {count && <span className="text-white/70 text-xs font-plex-sans">({count})</span>}
    </div>
);


export function FilterContainer() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [selectedPriceOptions, setSelectedPriceOptions] = useState<string[]>([]);
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);


  const priceOptions = [
    { id: 'under500', label: 'Under ₹500' },
    { id: '500-1000', label: '₹500 - ₹1000' },
    { id: '1000-1500', label: '₹1000 - ₹1500' },
    { id: '1500-2000', label: '₹1500 - ₹2000' },
    { id: 'over2000', label: 'Above ₹2000' },
  ];

  const flavourOptions = [
    { id: 'butterscotch', label: 'Butterscotch' },
    { id: 'dates', label: 'Dates' },
    { id: 'dark-chocolate', label: 'Dark Chocolate' },
    { id: 'fruit-nut', label: 'Fruit & Nut' },
    { id: 'hazelnut', label: 'Hazelnut' },
    { id: 'mint', label: 'Mint' },
    { id: 'plain-chocolates', label: 'Plain Chocolates' },
    { id: 'raisins', label: 'Raisins' },
    { id: 'roasted-almond', label: 'Roasted Almond' },
    { id: 'sugar-free', label: 'Sugar Free' },
    { id: 'white-chocolate', label: 'White Chocolate' },
  ];

  const occasionOptions = [
      { id: 'anniversaries', label: 'Anniversaries', count: 25 },
      { id: 'birthdays', label: 'Birthdays' },
      { id: 'business-gifting', label: 'Business Gifting' },
      { id: 'congratulations', label: 'Congratulations' },
      { id: 'corporate-gifting', label: 'Corporate Gifting' },
      { id: 'christmas-hampers', label: 'Christmas Hampers' },
      { id: 'diwali-delight', label: 'Diwali Delight' },
      { id: 'eid-special', label: 'Eid Special' },
      { id: 'festive-specials', label: 'Festive Specials' },
      { id: 'get-well-soon', label: 'Get Well Soon' },
      { id: 'graduation', label: 'Graduation' },
      { id: 'house-warming', label: 'House Warming' },
      { id: 'naming-ceremony', label: 'Naming Ceremony' },
      { id: 'new-year', label: 'New Year' },
      { id: 'raksha-bandhan', label: 'Raksha Bandhan' },
      { id: 'valentines-day', label: 'Valentine’s Day' },
      { id: 'teachers-day', label: 'Teacher’s Day' },
      { id: 'weddings', label: 'Weddings' },
  ];

  const productTypeOptions = [
      { id: 'tin-box', label: 'Tin Box', count: 16 },
      { id: 'soft-box', label: 'Soft Box' },
      { id: 'hard-box', label: 'Hard Box' },
      { id: 'pouchs', label: 'Pouchs' },
      { id: 'packets', label: 'Packets' },
      { id: 'gift-hampers', label: 'Gift Hampers' },
  ];

  const weightOptions = [
      { id: '250g', label: '250g', count: 18 },
      { id: '500g', label: '500g' },
      { id: '1kg', label: '1kg' },
  ];

  const handlePriceOptionChange = (optionId: string, checked: boolean) => {
    setSelectedPriceOptions(prev => 
      checked
        ? [...prev, optionId]
        : prev.filter(id => id !== optionId)
    );
  };
  
  const handleSliderChange = (value: [number, number]) => {
    setPriceRange(value);
    setSelectedPriceOptions([]);
  };

  const createHandler = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string, checked: boolean) => {
    setter(prev => checked ? [...prev, id] : prev.filter(val => val !== id));
  };

  const handleFlavourChange = createHandler(setSelectedFlavours);
  const handleOccasionChange = createHandler(setSelectedOccasions);
  const handleProductTypeChange = createHandler(setSelectedProductTypes);
  const handleWeightChange = createHandler(setSelectedWeights);

  return (
    <div className={cn("bg-[#5D2B79] h-full w-[17%] rounded-tr-[40px] animate-slide-in-from-left")} style={{ animationDuration: '0.5s' }}>
        <div className="bg-white/20 h-full w-full rounded-tr-[40px] pt-8 pl-8">
            <div className="h-full overflow-y-auto custom-scrollbar pr-8 pb-8">
                <div className="flex items-center text-white font-bold mb-6 text-lg">
                    <SlidersHorizontal className="h-6 w-6 mr-3 flex-shrink-0" />
                    <h2 className="h-full w-full font-poppins">Filters & Sorting</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm text-white/80 font-poppins">Price</p>
                    <p className="text-base text-white font-semibold font-plex-sans">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </p>
                    <Slider
                      value={priceRange}
                      onValueChange={handleSliderChange}
                      max={3000}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    {priceOptions.map((option) => (
                       <CheckboxItem
                          key={option.id}
                          id={option.id}
                          label={option.label}
                          checked={selectedPriceOptions.includes(option.id)}
                          onCheckedChange={(checked) => handlePriceOptionChange(option.id, checked)}
                        />
                    ))}
                  </div>
                  
                  <FilterSection title="Flavours & Fillings">
                    {flavourOptions.map((option) => (
                      <CheckboxItem
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        checked={selectedFlavours.includes(option.id)}
                        onCheckedChange={(checked) => handleFlavourChange(option.id, checked)}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection title="Best for Occasion">
                    {occasionOptions.map((option) => (
                      <CheckboxItem
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        count={option.count}
                        checked={selectedOccasions.includes(option.id)}
                        onCheckedChange={(checked) => handleOccasionChange(option.id, checked)}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection title="Product Type">
                    {productTypeOptions.map((option) => (
                      <CheckboxItem
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        count={option.count}
                        checked={selectedProductTypes.includes(option.id)}
                        onCheckedChange={(checked) => handleProductTypeChange(option.id, checked)}
                      />
                    ))}
                  </FilterSection>

                  <FilterSection title="Weight">
                    {weightOptions.map((option) => (
                      <CheckboxItem
                        key={option.id}
                        id={option.id}
                        label={option.label}
                        count={option.count}
                        checked={selectedWeights.includes(option.id)}
                        onCheckedChange={(checked) => handleWeightChange(option.id, checked)}
                      />
                    ))}
                  </FilterSection>

                </div>
            </div>
        </div>
    </div>
  );
}
