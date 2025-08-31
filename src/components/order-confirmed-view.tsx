// @/components/order-confirmed-view.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Phone } from 'lucide-react';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { Separator } from './ui/separator';
import { OrderSummaryItem } from './order-summary-item';

// Mock data for product prices - in a real app this would come from a database or state management
const productPrices: Record<string, number> = {
  'Diwali Collection Box 1': 799,
  'Diwali Collection Box 2': 1199,
  'Diwali Collection Box 3': 999,
  'Diwali Collection Box 4': 899,
  'Diwali Collection Box 5': 750,
  'Diwali Collection Box 6': 1250,
  'Diwali Collection Box 7': 600,
  'Diwali Collection Box 8': 1500,
  'Diwali Collection Box 9': 850,
  'Diwali Collection Box 10': 950,
  'Diwali Collection Box 11': 1100,
  'Diwali Collection Box 12': 1300,
};

interface OrderConfirmedViewProps {
    cart: Record<string, number>;
}

function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'CS';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function OrderConfirmedView({ cart }: OrderConfirmedViewProps) {
    const [orderId, setOrderId] = useState('');
    
    useEffect(() => {
        setOrderId(generateOrderId());
    }, []);

    const cartItems = Object.entries(cart);
    
    const subtotal = cartItems.reduce((acc, [name, quantity]) => {
        const price = productPrices[name] || 0;
        return acc + (price * quantity);
    }, 0);

    const discount = 500.00;
    const subtotalAfterDiscount = subtotal - discount;
    const gstRate = 0.18;
    const gstAmount = subtotalAfterDiscount * gstRate;
    const total = subtotalAfterDiscount + gstAmount;

  return (
    <div className="bg-[#5D2B79] rounded-[40px] mx-8 md:mx-32 animate-fade-in">
      <div className="bg-white/20 rounded-[40px] py-10 px-12 text-white">
        <div className="flex flex-col items-center gap-6 text-center text-black">
            
            {/* 1. Order Received Box */}
            <div className="bg-custom-gold text-custom-purple-dark font-bold text-2xl rounded-2xl px-6 py-3 flex items-center gap-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-tick"/>
                </svg>
                <span>Order Request Received!</span>
            </div>

            {/* 2. Order ID */}
            <p className="font-plex-sans font-semibold text-base">Order ID: {orderId}</p>

            {/* 3. Instructional Text */}
            <p className="font-plex-sans text-2xl max-w-2xl">
                To finalize your order and process the 50% advance payment, please connect with us directly.
            </p>

            {/* 4. Action Buttons */}
            <div className="flex items-center gap-4">
                 <Button asChild className="h-auto py-2.5 px-8 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full text-lg font-plex-sans border-2 border-white">
                    <a href="tel:+1234567890">
                        <Phone className="mr-2 h-5 w-5" /> Call Us
                    </a>
                </Button>
                <Button asChild className="h-auto py-2.5 px-8 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full text-lg font-plex-sans border-2 border-white">
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                        <AiOutlineWhatsApp className="mr-2 h-6 w-6" /> Whatsapp Us
                    </a>
                </Button>
            </div>

            {/* 5. Order Summary */}
            <div className="bg-white w-full rounded-2xl mt-4 text-black p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="font-bold text-xl">Order Summary</h3>
                    <p className="font-bold text-xl">Total: ₹{total > 0 ? total.toFixed(2) : '0.00'}</p>
                </div>
                <Separator className="bg-gray-300 flex-shrink-0" />
                <div className="flex-grow overflow-y-auto min-h-0 py-4 space-y-4 pr-2 always-visible-scrollbar max-h-[40vh]">
                     {cartItems.map(([name, quantity]) => (
                        <OrderSummaryItem
                            key={name}
                            productName={name}
                            quantity={quantity}
                            price={productPrices[name] || 0}
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
