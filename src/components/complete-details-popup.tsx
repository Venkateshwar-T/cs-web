// @/components/complete-details-popup.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface CompleteDetailsPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CompleteDetailsPopup({ open, onOpenChange }: CompleteDetailsPopupProps) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 w-auto max-w-md bg-custom-purple-dark rounded-[30px] border-2 border-custom-gold">
        <DialogHeader>
          <DialogTitle className="sr-only">Complete Your Details</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-8 text-white">
            <h2 className="text-2xl font-bold text-center">Complete Your Details</h2>
            <p className="text-sm text-center text-white/80">
                Just one more step! Please provide your details so our team can get in touch to confirm your order and arrange for payment.
            </p>
            
            <div className="space-y-1 text-left mt-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                    placeholder="Enter your full name"
                    className="bg-white rounded-lg text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-12"
                />
            </div>
            
            <div className="space-y-1 text-left">
                <label className="text-sm font-medium">Phone Number</label>
                <Input 
                    type="tel"
                    placeholder="Enter your phone number"
                    className="bg-white rounded-lg text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-12"
                />
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
                <DialogClose asChild>
                    <Button 
                        variant="outline"
                        className="bg-custom-purple-dark text-white border-custom-gold border-2 rounded-full px-6 hover:bg-custom-gold hover:text-custom-purple-dark"
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button className="bg-custom-gold text-custom-purple-dark rounded-full px-6 hover:bg-custom-gold/90">
                    Confirm
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
