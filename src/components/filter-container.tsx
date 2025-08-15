
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from 'lucide-react';

export function FilterContainer() {
  return (
    <div className={cn("bg-[#5D2B79] h-full w-[17%] rounded-tr-[40px] animate-slide-in-from-left")} style={{ animationDuration: '0.5s' }}>
        <div className="bg-white/20 h-full w-full rounded-tr-[40px] p-8">
            <div className="flex items-center text-white font-bold mb-6 text-lg xl:text-xl">
                <SlidersHorizontal className="h-6 w-6 mr-3 flex-shrink-0" />
                <h2 className="font-poppins">Filters & Sorting</h2>
            </div>
            {/* Content for the filter will go here */}
        </div>
    </div>
  );
}
