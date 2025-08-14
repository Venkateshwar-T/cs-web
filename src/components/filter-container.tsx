
import { cn } from "@/lib/utils";

export function FilterContainer() {
  return (
    <div className={cn("bg-[#5D2B79] h-full w-[17%] rounded-tr-[40px] animate-slide-in-from-left")} style={{ animationDuration: '0.5s' }}>
        <div className="bg-white/20 h-full w-full rounded-tr-[40px] p-8">
            {/* Content for the filter will go here */}
        </div>
    </div>
  );
}
