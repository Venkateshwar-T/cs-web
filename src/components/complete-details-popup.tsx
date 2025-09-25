
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
import { Separator } from './ui/separator';

interface CompleteDetailsPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (name: string, phone: string, address: string) => void;
}

export function CompleteDetailsPopup({ open, onOpenChange, onConfirm }: CompleteDetailsPopupProps) {
  const { profileInfo } = useAppContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  
  const city = "Bangalore";
  const state = "Karnataka";

  const { toast } = useToast();
  
  useEffect(() => {
    if (open) {
      setName(profileInfo.name || '');
      setPhone(profileInfo.phone || '');
      setHouse('');
      setArea('');
      setLandmark('');
      setPincode('');
    }
  }, [open, profileInfo]);


  const handleConfirm = () => {
    if (!name.trim() || !phone.trim() || phone.length !== 10 || !house.trim() || !area.trim() || !pincode.trim() || pincode.length !== 6) {
      toast({
        title: "Missing or Invalid Details",
        description: "Please fill all required fields: name, 10-digit phone, pincode, and address.",
        variant: "destructive",
      });
      return;
    }
    
    const addressParts = [house, area];
    if (landmark) addressParts.push(landmark);
    addressParts.push(`${city}, ${state} - ${pincode}`);
    
    const fullAddress = addressParts.join(', ');
    onConfirm(name, phone, fullAddress);
    onOpenChange(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhone(value);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPincode(value);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}>
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn("p-0 w-[90vw] max-w-md bg-custom-purple-dark rounded-2xl md:rounded-[30px] border-2 border-custom-gold")}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">Important: Confirm Your Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 px-6 pt-10 pb-6 text-white max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl md:text-3xl font-medium text-center font-plex-sans">Important: Confirm Your Details</h2>
            <p className="text-xs md:text-sm px-4 md:px-6 mt-2 text-center text-white/80">
                This is a crucial step. We need your name and phone number to reach out about payment and order confirmation.
            </p>
            
            <div className="space-y-1 text-left">
                <label className="pl-2 text-sm font-medium font-plex-sans">Name</label>
                <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                />
            </div>
            
            <div className="space-y-1 text-left">
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

            <Separator className="bg-white/20 my-2" />

            <div className='space-y-3'>
              <h3 className="text-lg font-medium text-center font-plex-sans">Delivery Address</h3>
              
              <div className="space-y-1 text-left">
                  <label className="pl-2 text-sm font-medium font-plex-sans">House No., Building Name</label>
                  <Input 
                      value={house}
                      onChange={(e) => setHouse(e.target.value)}
                      placeholder="e.g. A-123, Sunshine Apartments"
                      className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                  />
              </div>
              
              <div className="space-y-1 text-left">
                  <label className="pl-2 text-sm font-medium font-plex-sans">Street, Area, Colony</label>
                  <Input 
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. MG Road, Koramangala"
                      className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                  />
              </div>

               <div className="space-y-1 text-left">
                  <label className="pl-2 text-sm font-medium font-plex-sans">Landmark (Optional)</label>
                  <Input 
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near City Mall"
                      className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                  />
              </div>

              <div className="space-y-1 text-left">
                  <label className="pl-2 text-sm font-medium font-plex-sans">Pincode</label>
                  <Input 
                      value={pincode}
                      onChange={handlePincodeChange}
                      placeholder="6-digit Pincode"
                      className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                  />
              </div>
              
               <div className="flex gap-4">
                  <div className="space-y-1 text-left w-1/2">
                      <label className="pl-2 text-sm font-medium font-plex-sans">City</label>
                      <Input value={city} disabled className="bg-white/10 rounded-2xl text-white/70 h-10 md:h-12" />
                  </div>
                  <div className="space-y-1 text-left w-1/2">
                      <label className="pl-2 text-sm font-medium font-plex-sans">State</label>
                      <Input value={state} disabled className="bg-white/10 rounded-2xl text-white/70 h-10 md:h-12" />
                  </div>
              </div>
            </div>


            <div className="flex items-center justify-center gap-4 mt-4">
                <Button onClick={handleConfirm} className="bg-custom-gold text-sm md:text-base text-custom-purple-dark rounded-full px-8 md:px-10 hover:bg-custom-gold/90">
                    Confirm Details
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
