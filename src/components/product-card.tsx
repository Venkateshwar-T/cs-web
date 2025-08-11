import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ProductCard() {
  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative w-full pt-[100%]">
        <Image
          src="https://placehold.co/600x600.png"
          alt="Diwali Collection Box"
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
          data-ai-hint="gift box"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-bold text-base leading-tight">Diwali Collection Box</h3>
          <p className="text-xs text-muted-foreground mt-1">250g | Assorted | Hard Box</p>
        </div>
        <div className="flex justify-between items-end mt-4">
          <div className="flex items-end gap-2">
            <div>
              <p className="text-sm text-muted-foreground line-through">₹1000</p>
              <p className="font-bold text-base">₹750</p>
            </div>
            <Badge variant="destructive" className="text-xs mb-0.5">25% OFF</Badge>
          </div>
          <Button size="sm">Add</Button>
        </div>
      </div>
    </div>
  );
}
