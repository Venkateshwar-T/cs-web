// @/components/admin-order-details.tsx
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
import { Button } from "./ui/button";
import { X, User, Mail, Phone, Home, ShoppingCart, Percent } from "lucide-react";
import type { Order } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppContext } from "@/context/app-context";


interface AdminOrderDetailsProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-white/70 mt-0.5">{icon}</div>
        <div>
            <p className="text-xs text-white/70">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);

const OrderDetailsContent = ({ order }: { order: Order }) => {
    const { updateOrderStatus } = useAppContext();
    if (!order) return null;

    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const subtotal = order.items.reduce((acc, item) => acc + (item.finalSubtotal || 0), 0);
    const gstAmount = order.total - subtotal;
    const discountPercentage = order.totalDiscount && (subtotal + order.totalDiscount) > 0 ? ((order.totalDiscount / (subtotal + order.totalDiscount)) * 100) : 0;

    const statusOptions: Order['status'][] = ['Order Requested', 'In Progress', 'Completed', 'Cancelled'];

    const getStatusVariant = (status: Order['status'], isActive: boolean) => {
      if (isActive) {
        switch (status) {
          case 'Completed': return 'bg-green-600 text-white';
          case 'Cancelled': return 'bg-red-600 text-white';
          case 'In Progress': return 'bg-blue-500 text-white';
          default: return 'bg-yellow-500 text-black';
        }
      }
      return 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white';
    };


    const handleStatusChange = (newStatus: Order['status']) => {
        if (order.id && order.uid && newStatus !== order.status) {
            updateOrderStatus(order.uid, order.id, newStatus);
        }
    };


    return (
        <div className="flex flex-col gap-4 p-4 md:p-6 text-white max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <DetailRow icon={<User size={16} />} label="Customer Name" value={order.customerName} />
                <DetailRow icon={<Mail size={16} />} label="Email" value={order.customerEmail} />
                <DetailRow icon={<Phone size={16} />} label="Phone" value={order.customerPhone} />
                <DetailRow icon={<Home size={16} />} label="Address" value={order.address || 'Not Provided'} />
                <Separator className="bg-white/20" />
                <div>
                    <p className="text-xs text-white/70">Order ID</p>
                    <p className="font-semibold">{order.id}</p>
                </div>
                <div>
                    <p className="text-xs text-white/70">Date & Time</p>
                    <p className="font-semibold">{formattedDate} at {formattedTime}</p>
                </div>
            </div>

            <Separator className="bg-white/20" />

            <div>
                <h4 className="font-bold mb-2 flex items-center gap-2"><ShoppingCart size={18} /> Order Items</h4>
                <div className="space-y-3 bg-white/5 p-3 rounded-lg max-h-48 overflow-y-auto custom-scrollbar">
                    {order.items.map(item => (
                        <div key={item.name} className="flex gap-3">
                            <Image
                                src={item.coverImage || "/placeholder.png"}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="rounded-md flex-shrink-0 object-cover aspect-square"
                            />
                            <div className="flex-grow">
                                <p className="font-bold truncate">{item.name}</p>
                                <p className="text-xs text-white/70">Qty: {item.quantity} | Price: ₹{((item.finalProductPrice || 0) / item.quantity).toFixed(2)}</p>
                                {item.flavours && item.flavours.length > 0 && (
                                    <div className="text-xs text-white/60 mt-1">
                                        <p className="font-semibold">Flavours:</p>
                                        <ul className="list-disc list-inside">
                                            {item.flavours.map(f => <li key={f.name}>{f.name} (+₹{f.price.toFixed(2)})</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className='text-right'>
                                <p className="text-sm font-semibold">₹{item.finalSubtotal?.toFixed(2)}</p>
                                {item.mrp && item.finalProductPrice && <p className="text-xs text-green-400">-{((item.mrp || 0) * item.quantity - (item.finalProductPrice || 0)).toFixed(2)}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="bg-white/20" />
            
            <div>
                <h4 className="font-bold mb-2 flex items-center gap-2"><Percent size={18} /> Financials</h4>
                 <div className="space-y-1 bg-white/5 p-3 rounded-lg text-sm">
                    <div className="flex justify-between"><span className="text-white/80">Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-green-400"><span className="text-white/80">Discount ({discountPercentage.toFixed(1)}%):</span> <span>-₹{order.totalDiscount?.toFixed(2) ?? '0.00'}</span></div>
                    <div className="flex justify-between"><span className="text-white/80">GST ({order.gstPercentage}%):</span> <span>+₹{gstAmount.toFixed(2)}</span></div>
                    <Separator className="bg-white/20 my-1"/>
                    <div className="flex justify-between font-bold text-base"><span className="text-white/80">Total:</span> <span className="text-custom-gold">₹{order.total.toFixed(2)}</span></div>
                </div>
            </div>

            <Separator className="bg-white/20" />

             <div className="flex flex-col items-center justify-center gap-2 mt-2">
                <p className="text-sm text-white/80">Order Status</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {statusOptions.map((status) => (
                        <Button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={cn(
                                "text-xs h-8 px-3 rounded-full border-none focus:ring-0 focus:ring-offset-0 transition-all duration-200 w-36",
                                getStatusVariant(status, order.status === status)
                            )}
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

        </div>
    );
};


export function AdminOrderDetails({ order, open, onOpenChange }: AdminOrderDetailsProps) {
  const isMobile = useIsMobile();

  if (!order) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="bg-custom-purple-dark text-white border-t-2 border-custom-gold rounded-t-3xl h-[95vh] p-0">
          <SheetHeader className="p-4 border-b border-white/20 text-center">
            <SheetTitle className="text-white text-lg">Order Details</SheetTitle>
            
          </SheetHeader>
          <OrderDetailsContent order={order} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="justify-center p-0 w-[90vw] md:w-full max-w-md bg-custom-purple-dark border-2 border-custom-gold rounded-2xl md:rounded-[30px]">
        <DialogHeader className="p-4 md:p-6 border-b border-white/20 text-center">
          <DialogTitle className="text-white text-lg md:text-xl">Order Details</DialogTitle>
          <DialogClose className="absolute right-3 top-2 md:top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white z-10">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <OrderDetailsContent order={order} />
      </DialogContent>
    </Dialog>
  )
}
