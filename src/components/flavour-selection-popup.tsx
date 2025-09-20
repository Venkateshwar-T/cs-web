
// @/components/flavour-selection-popup.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import type { SanityProduct, SanityFlavour } from "@/types";
import { useState, useEffect } from "react";
import { FlavourCard } from "./flavour-card";
import { SectionTitle } from "./section-title";
import { cn } from "@/lib/utils";

interface FlavourSelectionPopupProps {
    product: SanityProduct | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (productName: string, flavours: string[]) => void;
}

export function FlavourSelectionPopup({ product, open, onOpenChange, onConfirm }: FlavourSelectionPopupProps) {
  const [selectedFlavours, setSelectedFlavours] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Reset selection when the popup is closed or product changes,
    // but pre-select if there's only one flavour.
    if (open && product) {
      const availableFlavours = product.availableFlavours || [];
      if (availableFlavours.length === 1) {
        setSelectedFlavours({ [availableFlavours[0]._id]: true });
      } else {
        setSelectedFlavours({});
      }
    } else {
      setSelectedFlavours({});
    }
  }, [open, product]);

  if (!product) return null;

  const handleToggleFlavour = (flavourId: string) => {
    setSelectedFlavours(prev => ({
        ...prev,
        [flavourId]: !prev[flavourId]
    }));
  };

  const handleConfirm = () => {
    const selectedFlavourNames = (product.availableFlavours || [])
      .filter(f => selectedFlavours[f._id])
      .map(f => f.name);
    onConfirm(product.name, selectedFlavourNames);
    onOpenChange(false);
  };

  const availableFlavours = product.availableFlavours || [];
  const hasFlavours = availableFlavours.length > 0;
  const isConfirmDisabled = Object.values(selectedFlavours).filter(Boolean).length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl bg-custom-purple-dark border-2 border-custom-gold mx-4 rounded-2xl md:rounded-[30px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Select Your Flavours</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white z-10">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-4 px-6 pt-10 pb-6 text-white max-h-[80vh]">
            <SectionTitle className="text-3xl text-center mb-0 font-poppins">
                {hasFlavours ? 'Customize Your Box' : 'Confirm Your Addition'}
            </SectionTitle>
            
            {hasFlavours ? (
                <>
                    <p className="text-sm px-6 -mt-2 text-center text-white/80">
                        Select your favorite flavours to be included in the <span className="font-bold text-custom-gold">{product.name}</span>.
                    </p>
                    <div className="bg-white/10 rounded-2xl p-4 overflow-y-auto custom-scrollbar">
                        <div className="flex flex-wrap justify-center gap-4">
                            {availableFlavours.map((flavour) => (
                                <FlavourCard
                                    key={flavour._id}
                                    flavour={flavour}
                                    onAddToCart={() => handleToggleFlavour(flavour._id)}
                                    quantity={selectedFlavours[flavour._id] ? 1 : 0}
                                />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-center text-white/80">This product doesn't have customizable flavours. You can add it directly to your cart.</p>
            )}

            <div className="flex items-center justify-center gap-4 mt-4">
                <DialogClose asChild>
                    <Button 
                        variant="outline"
                        className="bg-custom-purple-dark text-base text-white border-custom-gold border-2 rounded-full px-10 hover:bg-custom-gold hover:text-custom-purple-dark"
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button 
                    onClick={handleConfirm} 
                    className="bg-custom-gold text-base text-custom-purple-dark rounded-full px-10 hover:bg-custom-gold/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={hasFlavours && isConfirmDisabled}
                >
                    Confirm
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
