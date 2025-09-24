
// @/components/order-details-popup.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { X, Calendar, Hash, Tag } from "lucide-react";
import type { Order } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "./ui/badge";

interface OrderDetailsPopupProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
    <div className="flex items-center gap-3">
        <div className="flex-shrink-0 text-white/70">{icon}</div>
        <div className="text-sm">
            <p className="text-xs text-white/70">{label}</p>
            <div className="font-semibold">{value}</div>
        </div>
    </div>
);

const OrderDetailsContent = ({ order }: { order: Order }) => {
    if (!order) return null;

    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const subtotal = order.items.reduce((acc, item) => acc + (item.finalSubtotal || 0), 0);
    const gstAmount = order.total - subtotal;
    const totalMrp = order.items.reduce((acc, item) => acc + (item.mrp || ((item.finalProductPrice || 0) / item.quantity)) * item.quantity, 0)
    const discount = totalMrp > subtotal ? totalMrp - subtotal : 0;

    const statusVariant = (status: Order['status']): "success" | "destructive" | "default" => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Cancelled': return 'destructive';
            default: return 'default';
        }
    };


    return (
        <div className="flex flex-col gap-4 p-4 md:p-6 text-white max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-4">
                <DetailRow icon={<Hash size={16} />} label="Order ID" value={order.id} />
                <DetailRow icon={<Calendar size={16} />} label="Date & Time" value={`${formattedDate} at ${formattedTime}`} />
                <DetailRow icon={<Tag size={16} />} label="Order Status" value={<Badge variant={statusVariant(order.status)}>{order.status}</Badge>} />
            </div>

            <Separator className="bg-white/20" />

            <div>
                <h4 className="font-bold mb-2">Order Items</h4>
                <div className="bg-white/5 p-3 rounded-lg max-h-64 overflow-y-auto custom-scrollbar">
                    {order.items.map((item, index) => (
                        <div key={item.name} className="flex flex-col">
                            <div className="flex gap-3 items-start">
                                <Image
                                    src={item.coverImage || "/placeholder.png"}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="rounded-md flex-shrink-0 object-cover aspect-square w-16 h-16"
                                />
                                <div className="flex-grow min-w-0">
                                    <p className="font-bold text-base">{item.name}</p>
                                    <p className="text-xs text-white/70">Qty: {item.quantity} | MRP: ₹{item.mrp?.toFixed(2)}</p>
                                    <p className="text-xs text-green-400">Discount: -₹{((item.mrp || 0) * item.quantity - (item.finalProductPrice || 0)).toFixed(2)}</p>
                                </div>
                                <div className='text-right flex-shrink-0'>
                                    <p className="text-sm font-semibold">₹{item.finalSubtotal?.toFixed(2)}</p>
                                </div>
                            </div>
                             {item.flavours && item.flavours.length > 0 && (
                                <div className="text-xs text-white/60 mt-2 pl-2">
                                    <p className="font-semibold mb-1">Flavours:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {item.flavours.map(f => (
                                            <li key={f.name}>{f.name} (x{order.items.find(i => i.name === item.name)?.quantity || 1}) (+₹{f.price.toFixed(2)})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {index < order.items.length - 1 && <Separator className="bg-white/10 my-3" />}
                        </div>
                    ))}
                </div>
            </div>
            
            <Separator className="bg-white/20" />
            
            <div>
                 <h4 className="font-bold mb-2">Financials</h4>
                 <div className="space-y-1 bg-white/5 p-3 rounded-lg text-sm">
                    <div className="flex justify-between"><span className="text-white/80">Total MRP:</span> <span>₹{totalMrp.toFixed(2)}</span></div>
                    <div className="flex justify-between text-green-400"><span className="text-white/80">Total Discount:</span> <span>-₹{discount.toFixed(2)}</span></div>
                    <Separator className="bg-white/20 my-1"/>
                    <div className="flex justify-between"><span className="text-white/80">Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-white/80">GST ({order.gstPercentage}%):</span> <span>+₹{gstAmount.toFixed(2)}</span></div>
                    <Separator className="bg-white/20 my-1"/>
                    <div className="flex justify-between font-bold text-base"><span className="text-white/80">Grand Total:</span> <span className="text-custom-gold">₹{order.total.toFixed(2)}</span></div>
                </div>
            </div>

        </div>
    );
};


export function OrderDetailsPopup({ order, open, onOpenChange }: OrderDetailsPopupProps) {
  const isMobile = useIsMobile();

  if (!order) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="bg-custom-purple-dark text-white border-t-2 border-custom-gold rounded-t-3xl h-[90vh] p-0">
          <SheetHeader className="p-4 border-b border-white/20 text-center relative">
            <SheetTitle className="text-white text-lg">Order Details</SheetTitle>
             <SheetClose className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white z-10">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </SheetClose>
          </SheetHeader>
          <OrderDetailsContent order={order} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="justify-center p-0 w-[90vw] md:w-full max-w-lg bg-custom-purple-dark border-2 border-custom-gold rounded-2xl md:rounded-[30px]">
        <DialogHeader className="p-4 text-center border-b border-white/20">
          <DialogTitle className="text-white text-lg md:text-xl">Order Details</DialogTitle>
          <DialogClose className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white z-10">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <OrderDetailsContent order={order} />
      </DialogContent>
    </Dialog>
  )
}
