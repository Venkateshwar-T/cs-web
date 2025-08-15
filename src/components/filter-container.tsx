
'use client';

import { cn } from "@/lib/utils";
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function FilterContainer() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [selectedPriceOption, setSelectedPriceOption] = useState<string | undefined>();

  const priceOptions = [
    { id: 'under500', label: 'Under ₹500' },
    { id: '500-1000', label: '₹500 - ₹1000' },
    { id: '1000-1500', label: '₹1000 - ₹1500' },
    { id: '1500-2000', label: '₹1500 - ₹2000' },
    { id: 'over2000', label: 'Above ₹2000' },
  ];

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
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={3000}
                  step={100}
                  className="w-full"
                />
              </div>

              <RadioGroup value={selectedPriceOption} onValueChange={setSelectedPriceOption} className="space-y-2">
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
