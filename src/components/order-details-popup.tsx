
// @/components/order-details-popup.tsx
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription as SheetDescriptionComponent,
} from "@/components/ui/sheet"
import { X, Calendar, Hash, Check } from "lucide-react";
import type { Order, SanityProduct } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderDetailsPopupProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    products: SanityProduct[];
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

const TimelineNode = ({ isCompleted, isCurrent, status, children, isCancelled }: { isCompleted: boolean, isCurrent: boolean, status: Order['status'], children: React.ReactNode, isCancelled?: boolean }) => {
  const isBlinking = isCurrent && (status === 'Order Requested' || status === 'In Progress');
  
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500',
          isCancelled ? 'bg-red-500 border-red-500' :
          isCurrent && status === 'Order Requested' ? 'bg-custom-gold border-custom-gold' :
          isCurrent && status === 'In Progress' ? 'bg-blue-500 border-blue-500' :
          isCompleted ? 'bg-green-500 border-green-500' : 
          'bg-transparent border-white/50',
          isBlinking && 'animate-pulse'
        )}
      >
        {isCompleted && !isBlinking && <Check className="h-4 w-4 text-white" />}
        {isBlinking && <div className="w-2 h-2 md:w-3 md:h-3 bg-custom-purple-dark rounded-full"></div>}
      </div>
      <p className={cn('text-xs mt-2 text-center', (isCompleted || isCurrent || isCancelled) ? 'text-white font-semibold' : 'text-white/60')}>
        {children}
      </p>
    </div>
  );
};


const TimelineConnector = ({ isCompleted, isCancelled }: { isCompleted: boolean, isCancelled?: boolean }) => (
  <div className="flex-1 h-0.5 transition-all duration-500" style={{ background: isCancelled ? 'hsl(0, 100%, 50%)' : (isCompleted ? 'hsl(142.1, 76.2%, 36.3%)' : 'hsla(0, 0%, 100%, 0.3)') }} />
);


const OrderDetailsContent = ({ order, products }: { order: Order, products: SanityProduct[] }) => {
    if (!order) return null;

    const productsByName = products.reduce((acc, product) => {
        acc[product.name] = product;
        return acc;
    }, {} as Record<string, SanityProduct>);

    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    const subtotal = order.items.reduce((acc, item) => acc + (item.finalSubtotal || 0), 0);
    const gstAmount = order.total - subtotal;
    const totalMrp = order.items.reduce((acc, item) => acc + (item.mrp || ((item.finalProductPrice || 0) / item.quantity)) * item.quantity, 0)
    const discount = totalMrp > subtotal ? totalMrp - subtotal : 0;
    
    const statusSteps = ['Order Requested', 'In Progress', 'Completed'];
    const currentStatusIndex = statusSteps.indexOf(order.status);
    const isCancelled = order.status === 'Cancelled';


    return (
        <div className="flex flex-col gap-4 px-4 pb-4 md:px-6 md:py-3 text-white">
            <div className="grid grid-cols-1 gap-4">
                <DetailRow icon={<Hash size={16} />} label="Order ID" value={order.id} />
                <DetailRow icon={<Calendar size={16} />} label="Date & Time" value={`${formattedDate} at ${formattedTime}`} />
            </div>

            <Separator className="bg-white/20" />

            <div className="w-full">
              <h4 className="font-bold mb-3">Order Status</h4>
              <div className="flex items-center font-plex-sans w-full px-4">
                <TimelineNode isCompleted={currentStatusIndex >= 0} isCurrent={currentStatusIndex === 0} status={order.status} isCancelled={isCancelled}>Order<br/>Requested</TimelineNode>
                <TimelineConnector isCompleted={currentStatusIndex >= 1} isCancelled={isCancelled} />
                <TimelineNode isCompleted={currentStatusIndex >= 1} isCurrent={currentStatusIndex === 1} status={order.status} isCancelled={isCancelled}>In<br/>Progress</TimelineNode>
                <TimelineConnector isCompleted={currentStatusIndex >= 2} isCancelled={isCancelled}/>
                <TimelineNode isCompleted={currentStatusIndex >= 2} isCurrent={currentStatusIndex === 2} status={order.status} isCancelled={isCancelled}>Order<br />Delivered</TimelineNode>
              </div>
              {isCancelled && (
                <p className="text-red-400 font-semibold mt-4 text-sm text-center">This order has been cancelled.</p>
              )}
            </div>

            <Separator className="bg-white/20" />

            <div>
                <h4 className="font-bold mb-2">Order Items</h4>
                <div className="bg-white/5 p-3 rounded-lg space-y-3">
                    {order.items.map((item, index) => {
                        const product = productsByName[item.name];
                        return (
                            <React.Fragment key={item.name}>
                                 <div className="flex flex-col">
                                    <p className="font-bold text-base mb-2">{item.name}</p>
                                    <div className="flex gap-3 items-start">
                                        <Image
                                            src={item.coverImage || "/placeholder.png"}
                                            alt={item.name}
                                            width={64}
                                            height={64}
                                            className="rounded-md flex-shrink-0 object-cover aspect-square w-16 h-16"
                                        />
                                        <div className="flex-grow min-w-0">
                                            
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
                                            <ul className="space-y-1">
                                                {item.flavours.map(f => (
                                                    <li key={f.name} className="flex justify-between items-center">
                                                        <span className="w-24 inline-block truncate">{f.name}</span>
                                                        <span className="text-center w-16 inline-block">{product?.numberOfChocolates && `x${product.numberOfChocolates}`}</span>
                                                        <span className="text-right w-20 inline-block">(+₹{f.price.toFixed(2)})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                {index < order.items.length - 1 && <Separator className="bg-white/10 my-3" />}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
            
            <Separator className="bg-white/20" />
            
            <div>
                 <h4 className="font-bold mb-2">Bill Details</h4>
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


export function OrderDetailsPopup({ order, open, onOpenChange, products }: OrderDetailsPopupProps) {
  const isMobile = useIsMobile();

  if (!order) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="bg-custom-purple-dark text-white border-t-2 border-custom-gold rounded-t-3xl h-[90vh] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b border-white/20 text-center relative flex-shrink-0">
            <SheetTitle className="text-white text-lg">Order Details</SheetTitle>
            <SheetDescriptionComponent className="sr-only">
              A dialog showing the details of the selected order, including items, and bill breakdown.
            </SheetDescriptionComponent>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto">
            <OrderDetailsContent order={order} products={products} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="justify-center h-[90vh] w-[55vh] bg-custom-purple-dark border-2 border-custom-gold rounded-2xl rounded-[30px]">
        <DialogHeader className="p-4 text-center border-b border-white/20">
          <DialogTitle className="text-white text-xl">Order Details</DialogTitle>
          <DialogDescription className="sr-only">
            A dialog showing the details of the selected order, including items, and bill breakdown.
          </DialogDescription>
          <DialogClose className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white z-10">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="overflow-y-auto no-scrollbar">
          <OrderDetailsContent order={order} products={products} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
