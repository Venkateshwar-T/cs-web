
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className={cn("h-24 w-24 text-custom-gold animate-spin -mt-24", className)} />
    </div>
  );
}
