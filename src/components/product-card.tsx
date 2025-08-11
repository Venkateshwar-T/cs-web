import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ProductCard() {
  return (
    <div className="bg-white text-black rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
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
          <p className="text-xs text-gray-500 mt-1">250g | Assorted | Hard Box</p>
        </div>
        <div className="flex justify-between items-end mt-4 gap-2">
            <div className="flex items-end gap-1">
              <div>
                <p className="text-sm text-gray-500 line-through">₹1000</p>
                <p className="font-bold text-base">₹750</p>
              </div>
              <Badge variant="outline" className="text-xs mb-0.5 border-none text-custom-gold bg-transparent">25% OFF</Badge>
            </div>
            <Button
                size="sm"
                className="rounded-full uppercase bg-transparent border border-custom-purple-dark text-custom-purple-dark hover:bg-custom-purple-dark hover:text-white flex-grow"
            >
                Add
            </Button>
        </div>
      </div>
    </div>
  );
}
