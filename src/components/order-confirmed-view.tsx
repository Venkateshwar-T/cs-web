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
    <div className="bg-[#9A7DAB] rounded-[40px] py-8 px-72 text-white h-[85vh]">
      <div className="flex flex-col items-center gap-6 text-center">
          
          <div className="flex items-center">
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-custom-purple-dark border-4 border-custom-gold">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#FFD139" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-tick"/>
              </svg>
            </div>
            <div className="h-10 -ml-4 rounded-r-full bg-custom-gold pl-10 pr-6 flex items-center">
                <span className="text-custom-purple-dark font-bold text-xl">Order Request Received!</span>
            </div>
          </div>

          <p className="font-plex-sans font-semibold text-sm text-black">Order ID: {orderId}</p>

          <p className="font-semibold font-plex-sans text-xl max-w-2xl text-black">
              To finalize your order and process the 50% advance payment, please connect with us directly.
          </p>

          <div className="flex items-center gap-4">
               <Button asChild className="h-auto py-2 px-12 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full text-base font-plex-sans shadow-lg">
                  <a href="tel:+1234567890">
                      <Phone className="mr-2 h-4 w-4" /> Call Us
                  </a>
              </Button>
              <Button asChild className="h-auto py-2 px-8 bg-custom-purple-dark hover:bg-custom-purple-dark/90 text-white rounded-full text-base font-plex-sans shadow-lg">
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                      <AiOutlineWhatsApp className="mr-2 h-5 w-5" /> Whatsapp Us
                  </a>
              </Button>
          </div>

          <div className="bg-white w-full rounded-3xl mt-2 text-black p-6 flex flex-col">
              <div className="flex justify-between items-center flex-shrink-0">
                  <h3 className="font-bold text-xl">Order Summary</h3>
                  <p className="font-bold text-xl">Total: ₹{total > 0 ? total.toFixed(2) : '0.00'}</p>
              </div>
              <Separator className="bg-gray-300 flex-shrink-0 my-2" />
              <div className="flex-grow overflow-y-auto min-h-0 space-y-0 pr-2 always-visible-scrollbar max-h-[20vh]">
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
  );
}
