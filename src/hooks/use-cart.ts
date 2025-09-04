
'use client';

import { useState, useEffect, useCallback } from 'react';

const CART_STORAGE_KEY = 'chocoSmileyCart';

type Cart = Record<string, number>;

export function useCart() {
  const [cart, setCart] = useState<Cart>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // This effect runs only on the client and when the cart state changes
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
      }
    }
  }, [cart, isLoaded]);

  const updateCart = useCallback((productName: string, quantity: number) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (quantity <= 0) {
        delete newCart[productName];
      } else {
        newCart[productName] = quantity;
      }
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
  }, []);

  return { cart, updateCart, clearCart, isLoaded };
}
