
// @/components/cancellation-feedback-popup.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types';
import { useAppContext } from '@/context/app-context';

interface CancellationFeedbackPopupProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CancellationFeedbackPopup({ order, open, onOpenChange }: CancellationFeedbackPopupProps) {
  const { saveCancellationReason } = useAppContext();
  const [reason, setReason] = useState('');
  const { toast } = useToast();
  
  if (!order) return null;
  
  const handleSubmit = () => {
    if (!reason.trim()) {
      toast({ title: "Please provide a reason", description: "Your feedback is valuable to us.", variant: "destructive" });
      return;
    }
    saveCancellationReason(order.uid, order.id, reason);
    toast({ title: "Thank you for your feedback!", variant: "success" });
    onOpenChange(false);
    setReason('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        setReason(''); // Clear text area on close
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="justify-center p-0 w-[90vw] md:w-full max-w-md bg-custom-purple-dark border-2 border-custom-gold rounded-2xl md:rounded-[30px]">
        <DialogHeader className="p-4 text-center mb-4 border-b border-white/20">
          <DialogTitle className="text-white text-lg md:text-xl">Reason for Cancellation</DialogTitle>
          <DialogClose className="absolute right-3 top-2 md:top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white z-10">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-6 px-6 pb-6 text-white">
          <div className='text-center'>
            <p className="text-white/80 mb-2">We're sorry to see you go. Please let us know why you cancelled this order to help us improve.</p>
          </div>
          
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us more..."
            className="bg-white/10 rounded-xl h-24 border-white/30"
          />
          
          <Button onClick={handleSubmit} className="w-full bg-custom-gold text-custom-purple-dark font-bold hover:bg-custom-gold/90 h-10 text-base rounded-full">
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
