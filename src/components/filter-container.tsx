
'use client';

import { cn } from "@/lib/utils";
import { SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function FilterContainer() {
  const [priceRange, setPriceRange] =useState<[number, number]>([0, 3000]);
  const [selectedPriceOption, setSelectedPriceOption] = useState<string | undefined>();

  const priceOptions = [
    { id: 'under500', label: 'Under ₹500', range: [0, 500] as [number, number] },
    { id: '500-1000', label: '₹500 - ₹1000', range: [500, 1000] as [number, number] },
    { id: '1000-1500', label: '₹1000 - ₹1500', range: [1000, 1500] as [number, number] },
    { id: '1500-2000', label: '₹1500 - ₹2000', range: [1500, 2000] as [number, number] },
    { id: 'over2000', label: 'Above ₹2000', range: [2000, 3000] as [number, number] },
  ];

  const handlePriceOptionChange = (value: string) => {
    setSelectedPriceOption(value);
    const selectedOption = priceOptions.find(option => option.id === value);
    if (selectedOption) {
      setPriceRange(selectedOption.range);
    }
  };

  const handleSliderChange = (value: [number, number]) => {
    setPriceRange(value);
    // If slider is moved, deselect the radio button
    const matchingOption = priceOptions.find(option => option.range[0] === value[0] && option.range[1] === value[1]);
    if (!matchingOption) {
      setSelectedPriceOption(undefined);
    }
  };

  useEffect(() => {
    // A side effect to deselect radio if slider is manually moved to a range
    // not matching any predefined option.
    const isMatchingOption = priceOptions.some(
      (option) =>
        option.range[0] === priceRange[0] && option.range[1] === priceRange[1]
    );
    if (!isMatchingOption) {
      setSelectedPriceOption(undefined);
    }
  }, [priceRange, priceOptions]);

  return (
    <div className={cn("bg-[#5D2B79] h-full w-[17%] rounded-tr-[40px] animate-slide-in-from-left")} style={{ animationDuration: '0.5s' }}>
        <div className="bg-white/20 h-full w-full rounded-tr-[40px] p-8">
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

              <RadioGroup value={selectedPriceOption} onValueChange={handlePriceOptionChange} className="space-y-2">
                {priceOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="text-white font-plex-sans text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

            </div>
        </div>
    </div>
  );
}
