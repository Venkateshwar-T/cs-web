// @/components/admin-order-details.tsx
'use client';

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
  SheetDescription,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription as AlertDialogDescriptionComponent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogTitleComponent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X, User, Mail, Phone, Home, ShoppingCart, Percent, Info, Star, MessageSquareWarning } from "lucide-react";
import type { Order, SanityProduct } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppContext } from "@/context/app-context";
import { Badge } from "./ui/badge";


interface AdminOrderDetailsProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    allProducts: SanityProduct[];
}

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-white/70 mt-0.5">{icon}</div>
        <div>
            <p className="text-xs text-white/70">{label}</p>
            <div className="font-semibold">{value}</div>
        </div>
    </div>
);

const OrderDetailsContent = ({ order: initialOrder, allProducts }: { order: Order, allProducts: SanityProduct[] }) => {
    const { updateOrderStatus, allOrders } = useAppContext();
    
    // This state will hold the most current version of the order.
    const [order, setOrder] = React.useState(initialOrder);

    // This effect hook listens for changes in the global 'allOrders' list.
    // When it changes, we find the latest version of our order and update the local state.
    React.useEffect(() => {
        const updatedOrder = allOrders.find(o => o.id === initialOrder.id);
        if (updatedOrder) {
            setOrder(updatedOrder); // This will trigger a re-render with the new status
        }
    }, [allOrders, initialOrder.id]);

    if (!order) return null;
    
    const productsByName = allProducts.reduce((acc, product) => {
        acc[product.name] = product;
        return acc;
    }, {} as Record<string, SanityProduct>);

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
          case 'Completed': return 'bg-green-600 text-white hover:bg-green-700';
          case 'Cancelled': return 'bg-red-600 text-white hover:bg-red-700';
          case 'In Progress': return 'bg-blue-500 text-white hover:bg-blue-600';
          default: return 'bg-custom-gold text-custom-purple-dark hover:bg-custom-gold/90';
        }
      }
      return 'bg-white/10 text-white/70 hover:bg-white/20';
    };

    const handleStatusChange = (newStatus: Order['status']) => {
        if (order.id && order.uid && newStatus !== order.status) {
            updateOrderStatus(order.uid, order.id, newStatus, 'admin');
        }
    };

    return (
        <div className="flex flex-col gap-4 px-4 md:p-0 text-white h-full no-scrollbar">
            <div className="grid grid-cols-1 gap-4">
                <DetailRow icon={<User size={16} />} label="Customer Name" value={order.customerName || 'Loading...'} />
                <DetailRow icon={<Mail size={16} />} label="Email" value={order.customerEmail || 'Loading...'} />
                <DetailRow icon={<Phone size={16} />} label="Phone" value={
                  order.customerPhone ? (
                      <a href={`tel:${order.customerPhone}`}>
                          {order.customerPhone}
                      </a>
                  ) : 'Loading...'
                } />
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
                <h4 className="font-bold mb-2 flex items-center gap-2">Order Items</h4>
                 <div className="bg-white/5 p-3 rounded-lg space-y-3">
                    {order.items.map((item, index) => {
                        const product = productsByName[item.name];
                        return (
                            <React.Fragment key={`${item.name}-${index}`}>
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
                <h4 className="font-bold mb-2 flex items-center gap-2">Bill Details</h4>
                 <div className="space-y-1 bg-white/5 p-3 rounded-lg text-sm">
                    <div className="flex justify-between"><span className="text-white/80">Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-green-400"><span className="text-white/80">Discount ({discountPercentage.toFixed(1)}%):</span> <span>-₹{order.totalDiscount?.toFixed(2) ?? '0.00'}</span></div>
                    <div className="flex justify-between"><span className="text-white/80">GST ({order.gstPercentage}%):</span> <span>+₹{gstAmount.toFixed(2)}</span></div>
                    <Separator className="bg-white/20 my-1"/>
                    <div className="flex justify-between font-bold text-base"><span className="text-white/80">Total:</span> <span className="text-custom-gold">₹{order.total.toFixed(2)}</span></div>
                </div>
            </div>
            
            {(order.rating || order.feedback) && (
                 <>
                    <Separator className="bg-white/20" />
                     <div>
                        <h4 className="font-bold mb-2 flex items-center gap-2"><Star size={18} /> Customer Feedback</h4>
                        <div className="bg-white/5 p-3 rounded-lg space-y-2">
                           {order.rating && (
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-white/80">Rating:</p>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("h-5 w-5", (order.rating || 0) > i ? "text-custom-gold fill-custom-gold" : "text-white/50")}/>
                                    ))}
                                </div>
                            </div>
                           )}
                           {order.feedback && (
                            <div>
                                <p className="text-sm text-white/80">Feedback:</p>
                                <blockquote className="text-sm italic border-l-2 border-custom-gold pl-2 ml-1 mt-1">"{order.feedback}"</blockquote>
                            </div>
                           )}
                        </div>
                    </div>
                 </>
            )}
            
            {order.cancellationReason && (
              <>
                <Separator className="bg-white/20" />
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-red-400"><MessageSquareWarning size={18} /> Cancellation Reason</h4>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <blockquote className="text-sm italic border-l-2 border-red-400 pl-2 ml-1">"{order.cancellationReason}"</blockquote>
                  </div>
                </div>
              </>
            )}


            <Separator className="bg-white/20" />

            {order.cancelledBy === 'user' ? (
                <div className="flex flex-col items-center justify-center gap-2 pb-4 text-center">
                    <p className="text-sm font-semibold text-red-400">This order was cancelled by the user.</p>
                    <p className="text-xs text-white/70">No further actions can be taken.</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 pb-4">
                    <p className="text-sm text-white/80">Change Order Status</p>
                    <div className="flex flex-wrap justify-center gap-2 w-full">
                        {statusOptions.map((status) => {
                            const buttonContent = (
                                <Button
                                    key={status}
                                    variant="ghost"
                                    onClick={() => { if (status !== 'Cancelled') handleStatusChange(status) }}
                                    className={cn(
                                        "text-xs h-8 px-3 rounded-full border-none focus:ring-0 focus:ring-offset-0 transition-all duration-200 w-1/2",
                                        getStatusVariant(status, order.status === status)
                                    )}
                                >
                                    {status}
                                </Button>
                            );

                            if (status === 'Cancelled') {
                                return (
                                    <AlertDialog key="cancel-dialog">
                                        <AlertDialogTrigger asChild>{buttonContent}</AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitleComponent>Are you sure?</AlertDialogTitleComponent>
                                                <AlertDialogDescriptionComponent>
                                                    The user's order will be cancelled. You can change the status back if you wish.
                                                </AlertDialogDescriptionComponent>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>No</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleStatusChange('Cancelled')}>Yes, Cancel Order</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                );
                            }
                            
                            return buttonContent;
                        })}
                    </div>
                </div>
            )}

        </div>
    );
};


export function AdminOrderDetails({ order, open, onOpenChange, allProducts }: AdminOrderDetailsProps) {
  const isMobile = useIsMobile();

  if (!order) return null;

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="bg-custom-purple-dark text-white border-t-2 border-custom-gold rounded-t-3xl h-[90vh] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b border-white/20 text-center flex-shrink-0">
              <SheetTitle className="text-white text-lg">Order Details</SheetTitle>
              <SheetDescription className="sr-only">
                A dialog showing the details of the selected order, including customer information, items, and bill breakdown.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto">
              <OrderDetailsContent order={order} allProducts={allProducts} />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="justify-center p-0 w-[90vw] md:w-full max-w-md bg-custom-purple-dark border-2 border-custom-gold rounded-2xl md:rounded-[30px] h-[90vh]">
            <DialogHeader className="p-4 text-center mb-4 border-b border-white/20">
              <DialogTitle className="text-white text-lg md:text-xl">Order Details</DialogTitle>
              <DialogDescription className="sr-only">
                A dialog showing the details of the selected order, including customer information, items, and bill breakdown.
              </DialogDescription>
              <DialogClose className="absolute right-3 top-2 md:top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white z-10">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
            <div className="overflow-y-auto no-scrollbar px-6 pb-6">
              <OrderDetailsContent order={order} allProducts={allProducts} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}