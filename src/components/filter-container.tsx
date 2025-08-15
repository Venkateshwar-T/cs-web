
'use client';

import { cn } from "@/lib/utils";
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

export function FilterContainer() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);

  return (
    <div className={cn("bg-[#5D2B79] h-full w-[17%] rounded-tr-[40px] animate-slide-in-from-left")} style={{ animationDuration: '0.5s' }}>
        <div className="bg-white/20 h-full w-full rounded-tr-[40px] p-8">
            <div className="flex items-center text-white font-bold mb-6 text-lg">
                <SlidersHorizontal className="h-6 w-6 mr-3 flex-shrink-0" />
                <h2 className="h-full w-full font-poppins">Filters & Sorting</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/80 font-poppins">Price</p>
                <p className="text-base text-white font-semibold font-plex-sans">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </p>
              </div>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={3000}
                step={100}
                className="w-full"
              />
            </div>
        </div>
    </div>
  );
}
