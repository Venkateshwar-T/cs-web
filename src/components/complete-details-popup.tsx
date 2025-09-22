
// @/components/complete-details-popup.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/app-context';

interface CompleteDetailsPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (name: string, phone: string) => void;
}

export function CompleteDetailsPopup({ open, onOpenChange, onConfirm }: CompleteDetailsPopupProps) {
  const { profileInfo } = useAppContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    if (open) {
      setName(profileInfo.name || '');
      setPhone(profileInfo.phone || '');
    } else {
      // Clear fields when popup closes
      setName('');
      setPhone('');
    }
  }, [open, profileInfo]);


  const handleConfirm = () => {
    if (!name.trim() || !phone.trim() || phone.length !== 10) {
      toast({
        title: "Missing or Invalid Details",
        description: "Please fill in your full name and a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    onConfirm(name, phone);
    onOpenChange(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits and limit to 10 characters
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhone(value);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}>
      <DialogContent 
        onInteractOutside={(e) => e.preventDefault()}
        className={cn("p-0 w-[90vw] max-w-sm bg-custom-purple-dark rounded-2xl md:rounded-[30px] border-2 border-custom-gold")}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">Complete Your Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 px-6 pt-10 pb-6 text-white">
            <h2 className="text-2xl md:text-3xl font-medium text-center font-plex-sans">Complete Your Details</h2>
            <p className="text-xs md:text-sm px-4 md:px-6 mt-2 text-center text-white/80">
                Just one more step! Please provide your details so our team can get in touch to confirm your order and arrange for payment.
            </p>
            
            <div className="space-y-1 px-2 md:px-5 text-left">
                <label className="pl-2 text-sm font-medium font-plex-sans">Name</label>
                <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                />
            </div>
            
            <div className="space-y-1 px-2 md:px-5 text-left">
                <label className="pl-2 text-sm font-medium font-plex-sans">Phone Number</label>
                 <div className="flex items-center bg-white rounded-2xl h-10 md:h-12 overflow-hidden">
                    <span className="text-black font-montserrat px-3 border-r border-gray-300">+91</span>
                    <Input 
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="Enter your phone number"
                        className="bg-transparent text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
                <Button onClick={handleConfirm} className="bg-custom-gold text-sm md:text-base text-custom-purple-dark rounded-full px-8 md:px-10 hover:bg-custom-gold/90">
                    Confirm
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
