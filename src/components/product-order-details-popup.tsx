
// @/components/product-order-details-popup.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { X, RotateCcw, Eye } from "lucide-react";
import type { SanityProduct } from "@/types";
import type { OrderItem } from "@/context/app-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppContext } from "@/context/app-context";

interface ProductOrderDetailsPopupProps {
    details: { orderItem: OrderItem } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onViewProduct?: (productName: string) => void;
}

export function ProductOrderDetailsPopup({ details, open, onOpenChange, onViewProduct }: ProductOrderDetailsPopupProps) {
  const { reorderItem } = useAppContext();
  if (!details) return null;

  const { orderItem } = details;

  const handleViewClick = () => {
    if (onViewProduct) {
        onViewProduct(orderItem.name);
        onOpenChange(false);
    }
  }
  

  const handleOrderAgainClick = () => {
    reorderItem(orderItem);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="justify-center p-0 w-[90vw] md:w-full max-w-md bg-custom-purple-dark border-2 border-custom-gold rounded-2xl md:rounded-[30px]">
        <DialogHeader>
          <DialogTitle className="sr-only">{orderItem.name}</DialogTitle>
          <DialogClose className="absolute right-3 top-2 md:top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white z-10">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4 md:p-6 text-white max-h-[80vh]">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="w-2/5 md:w-1/3 flex-shrink-0">
                    <Image
                        src={orderItem.coverImage || '/placeholder.png'}
                        alt={orderItem.name}
                        width={200}
                        height={200}
                        className="rounded-xl md:rounded-3xl object-cover w-full aspect-square"
                        data-ai-hint="chocolate box"
                    />
                </div>
                <div className="w-full md:w-2/3 flex flex-col gap-1 text-center md:text-left">
                    <h3 className="font-bold text-lg leading-tight">{orderItem.name}</h3>
                    <p className="text-xs text-white/80">{((orderItem.finalProductPrice || 0) / orderItem.quantity).toFixed(2)} x {orderItem.quantity}</p>
                </div>
            </div>

            {(orderItem.flavours && orderItem.flavours.length > 0) && (
                <div className="bg-white/10 rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2">Flavours Selected</h4>
                    <ul className="flex flex-col gap-x-4 gap-y-1 list-disc list-inside text-xs">
                        {orderItem.flavours.map((flavour) => (
                            <li key={flavour.name}>{flavour.name} (+₹{flavour.price})</li>
                        ))}
                    </ul>
                </div>
            )}

            <Separator className="bg-white/20" />

            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                <span className="font-semibold text-base">Final Price Paid</span>
                <span className="font-bold text-xl">₹{orderItem.finalSubtotal?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                {onViewProduct ? (
                    <>
                        <Button 
                            onClick={handleViewClick}
                            variant="outline"
                            className="w-full bg-transparent text-sm text-white border-custom-gold border rounded-full hover:bg-custom-gold hover:text-custom-purple-dark"
                        >
                            <Eye className="mr-2 h-4 w-4" /> View Product
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full bg-custom-gold text-sm text-custom-purple-dark rounded-full hover:bg-custom-gold/90">
                                   <RotateCcw className="mr-2 h-4 w-4" /> Order Again
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Order this item again?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This will add {orderItem.quantity} x {orderItem.name} to your cart.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleOrderAgainClick}>Confirm</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                ) : (
                    <DialogClose asChild>
                        <Button 
                            variant="outline"
                            className="w-full mx-auto bg-custom-gold text-sm text-custom-purple-dark rounded-full hover:bg-custom-gold/90 hover:text-custom-purple-dark"
                        >
                            Close
                        </Button>
                    </DialogClose>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
