
// @/context/app-context.tsx
'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import type { ProfileInfo } from '@/app/page';
import { useLocalStorage } from '@/hooks/use-local-storage';

const PROFILE_STORAGE_KEY = 'chocoSmileyProfile';
const WISHLIST_STORAGE_KEY = 'chocoSmileyWishlist';
const ORDERS_STORAGE_KEY = 'chocoSmileyOrders';
const CART_STORAGE_KEY = 'chocoSmileyCart';

export type OrderItem = {
  name: string;
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  status: 'Order Requested' | 'In Progress' | 'Completed' | 'Cancelled';
  total: number;
};

type Cart = Record<string, number>;

interface AppContextType {
  profileInfo: ProfileInfo;
  updateProfileInfo: (newInfo: Partial<ProfileInfo>) => void;
  isProfileLoaded: boolean;
  
  likedProducts: Record<number, boolean>;
  toggleLike: (productId: number) => void;
  clearWishlist: () => void;
  
  orders: Order[];
  addOrder: (newOrder: Order) => void;
  isOrdersLoaded: boolean;
  clearOrders: () => void;

  cart: Cart;
  updateCart: (productName: string, quantity: number) => void;
  clearCart: () => void;
  isCartLoaded: boolean;
}

const defaultProfileInfo: ProfileInfo = {
    name: 'John Doe',
    phone: '+1 234 567 890',
    email: 'john.doe@example.com',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [profileInfo, setProfileInfo, isProfileLoaded] = useLocalStorage<ProfileInfo>(
    PROFILE_STORAGE_KEY,
    defaultProfileInfo
  );
  
  const [likedProducts, setLikedProducts, isWishlistLoaded] = useLocalStorage<Record<number, boolean>>(
    WISHLIST_STORAGE_KEY,
    {}
  );
  
  const [orders, setOrders, isOrdersLoaded] = useLocalStorage<Order[]>(
    ORDERS_STORAGE_KEY,
    []
  );

  const [cart, setCart, isCartLoaded] = useLocalStorage<Cart>(
    CART_STORAGE_KEY,
    {}
  );

  const updateProfileInfo = useCallback((newInfo: Partial<ProfileInfo>) => {
    setProfileInfo(prev => ({ ...prev, ...newInfo }));
  }, [setProfileInfo]);

  const toggleLike = useCallback((productId: number) => {
    setLikedProducts(prev => {
      const newLiked = { ...prev };
      if (newLiked[productId]) {
        delete newLiked[productId];
      } else {
        newLiked[productId] = true;
      }
      return newLiked;
    });
  }, [setLikedProducts]);

  const clearWishlist = useCallback(() => {
    setLikedProducts({});
  }, [setLikedProducts]);

  const addOrder = useCallback((newOrder: Order) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  }, [setOrders]);

  const clearOrders = useCallback(() => {
    setOrders([]);
  }, [setOrders]);

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
  }, [setCart]);

  const clearCart = useCallback(() => {
    setCart({});
  }, [setCart]);


  const value: AppContextType = {
    profileInfo,
    updateProfileInfo,
    isProfileLoaded,
    likedProducts,
    toggleLike,
    clearWishlist,
    orders,
    addOrder,
    isOrdersLoaded,
    clearOrders,
    cart,
    updateCart,
    clearCart,
    isCartLoaded,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
