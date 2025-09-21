
// @/context/app-context.tsx
'use client';

import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import type { SanityProduct } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, signOutUser } from '@/lib/firebase';
import type { User } from 'firebase/auth';

const defaultProfileInfo: ProfileInfo = {
    name: '',
    phone: '',
    email: '',
};

const WISHLIST_STORAGE_KEY = 'chocoSmileyWishlist';
const ORDERS_STORAGE_KEY = 'chocoSmileyOrders';
const CART_STORAGE_KEY = 'chocoSmileyCart';

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
  reorder: (orderId: string) => void;

  cart: Cart;
  updateCart: (productName: string, quantity: number, flavours?: string[]) => void;
  clearCart: () => void;
  isCartLoaded: boolean;

  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  authPopup: AuthPopupType;
  setAuthPopup: (popup: AuthPopupType) => void;

  flavourSelection: {
    product: SanityProduct | null;
    isOpen: boolean;
  };
  setFlavourSelection: (selection: { product: SanityProduct | null; isOpen: boolean }) => void;
}

export type ProfileInfo = {
    name: string;
    phone: string;
    email: string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  
  const profileStorageKey = user ? `chocoSmileyProfile-${user.uid}` : 'chocoSmileyProfile-guest';

  const [profileInfo, setProfileInfo, isProfileLoaded] = useLocalStorage<ProfileInfo>(
    profileStorageKey,
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

  const [authPopup, setAuthPopup] = useState<AuthPopupType>(null);
  const [flavourSelection, setFlavourSelection] = useState<{ product: SanityProduct | null; isOpen: boolean }>({ product: null, isOpen: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((newUser) => {
      setUser(newUser);
      setIsAuthenticated(!!newUser);
      setIsAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isProfileLoaded) return; // Wait for profile to be loaded from localStorage

    if (user) {
        // User is logged in, check for existing profile
        const userProfileKey = `chocoSmileyProfile-${user.uid}`;
        const storedProfile = localStorage.getItem(userProfileKey);
        
        if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile);
            // If the stored profile isn't the same as the one in state, update the state.
            if (JSON.stringify(parsedProfile) !== JSON.stringify(profileInfo)) {
              setProfileInfo(parsedProfile);
            }
        } else {
            // New user or no profile yet, create one from auth details
            setProfileInfo({
                name: user.displayName || '',
                email: user.email || '',
                phone: user.phoneNumber || '',
            });
        }
    } else {
        // User is logged out, ensure we are using the guest profile
        if (JSON.stringify(profileInfo) !== JSON.stringify(defaultProfileInfo)) {
            setProfileInfo(defaultProfileInfo);
        }
    }
  }, [user, isProfileLoaded, setProfileInfo, profileInfo]);


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

  const reorder = useCallback((orderId: string) => {
    const orderToReorder = orders.find(o => o.id === orderId);
    if (!orderToReorder) return;

    setCart(prevCart => {
      const newCart = { ...prevCart };
      orderToReorder.items.forEach(item => {
        if (newCart[item.name]) {
          // If item exists, add quantity and merge flavours (removing duplicates)
          newCart[item.name].quantity += item.quantity;
          const existingFlavours = newCart[item.name].flavours || [];
          const newFlavours = item.flavours || [];
          newCart[item.name].flavours = [...new Set([...existingFlavours, ...newFlavours])];
        } else {
          // Otherwise, add the new item to the cart
          newCart[item.name] = { ...item };
        }
      });
      return newCart;
    });

    toast({
      title: "Order Added to Cart",
      description: "All items from your previous order have been added to your cart.",
      variant: "success",
    });

  }, [orders, setCart, toast]);


  const clearCart = useCallback(() => {
    setCart({});
  }, [setCart]);

  const login = useCallback((loggedInUser: User) => {
    // This function is now mostly a placeholder as the onAuthStateChanged effect handles the logic.
    // It can be used to manually trigger state updates if needed, but is generally not required.
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutUser();
      // onAuthStateChanged will handle setting user to null and resetting profile.
      setAuthPopup(null); // Close any auth popups
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);


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
    reorder,
    cart,
    updateCart,
    clearCart,
    isCartLoaded,
    isAuthenticated,
    user,
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
