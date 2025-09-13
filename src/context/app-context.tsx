// @/context/app-context.tsx
'use client';

import { createContext, useContext, ReactNode, useCallback, useState } from 'react';
import type { ProfileInfo, SanityProduct } from '@/app/page';
import { useLocalStorage } from '@/hooks/use-local-storage';

const PROFILE_STORAGE_KEY = 'chocoSmileyProfile';
const WISHLIST_STORAGE_KEY = 'chocoSmileyWishlist';
const ORDERS_STORAGE_KEY = 'chocoSmileyOrders';
const CART_STORAGE_KEY = 'chocoSmileyCart';
const AUTH_STORAGE_KEY = 'chocoSmileyAuth';

export type OrderItem = {
  name: string;
  quantity: number;
  flavours?: string[];
};

export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  status: 'Order Requested' | 'In Progress' | 'Completed' | 'Cancelled';
  total: number;
};

type Cart = Record<string, OrderItem>;
type AuthPopupType = 'login' | 'signup' | 'completeDetails' | null;

interface AppContextType {
  profileInfo: ProfileInfo;
  updateProfileInfo: (newInfo: Partial<ProfileInfo>) => void;
  isProfileLoaded: boolean;
  
  likedProducts: Record<string, boolean>;
  toggleLike: (productId: string) => void;
  clearWishlist: () => void;
  
  orders: Order[];
  addOrder: (newOrder: Order) => void;
  isOrdersLoaded: boolean;
  clearOrders: () => void;

  cart: Cart;
  updateCart: (productName: string, quantity: number, flavours?: string[]) => void;
  clearCart: () => void;
  isCartLoaded: boolean;

  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  authPopup: AuthPopupType;
  setAuthPopup: (popup: AuthPopupType) => void;

  flavourSelection: {
    product: SanityProduct | null;
    isOpen: boolean;
  };
  setFlavourSelection: (selection: { product: SanityProduct | null; isOpen: boolean }) => void;
}

const defaultProfileInfo: ProfileInfo = {
    name: 'Jane Doe',
    phone: '',
    email: 'jane.doe@example.com',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [profileInfo, setProfileInfo, isProfileLoaded] = useLocalStorage<ProfileInfo>(
    PROFILE_STORAGE_KEY,
    defaultProfileInfo
  );
  
  const [likedProducts, setLikedProducts, isWishlistLoaded] = useLocalStorage<Record<string, boolean>>(
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

  const [isAuthenticated, setIsAuthenticated, isAuthLoaded] = useLocalStorage<boolean>(
    AUTH_STORAGE_KEY,
    false
  );

  const [authPopup, setAuthPopup] = useState<AuthPopupType>(null);
  const [flavourSelection, setFlavourSelection] = useState<{ product: SanityProduct | null; isOpen: boolean }>({ product: null, isOpen: false });


  const updateProfileInfo = useCallback((newInfo: Partial<ProfileInfo>) => {
    setProfileInfo(prev => ({ ...prev, ...newInfo }));
  }, [setProfileInfo]);

  const toggleLike = useCallback((productId: string) => {
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

  const updateCart = useCallback((productName: string, quantity: number, flavours?: string[]) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (quantity <= 0) {
        delete newCart[productName];
      } else {
        const existingItem = newCart[productName] || { name: productName, quantity: 0 };
        newCart[productName] = {
          ...existingItem,
          quantity,
          // Only update flavours if they are provided, otherwise keep existing ones
          flavours: flavours !== undefined ? flavours : existingItem.flavours,
        };
      }
      return newCart;
    });
  }, [setCart]);


  const clearCart = useCallback(() => {
    setCart({});
  }, [setCart]);

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, [setIsAuthenticated]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);


  const value: AppContextType = {
    profileInfo,
    updateProfileInfo,
    isProfileLoaded: isProfileLoaded && isAuthLoaded,
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
    isAuthenticated,
    login,
    logout,
    authPopup,
    setAuthPopup,
    flavourSelection,
    setFlavourSelection,
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
