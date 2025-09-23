// @/context/app-context.tsx
'use client';

import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import type { SanityProduct } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import {
  onAuthStateChanged,
  signOutUser,
  getFirebaseAuth,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  addUserOrder,
  getUserOrders,
} from '@/lib/firebase';
import type { User } from 'firebase/auth';

const defaultProfileInfo: ProfileInfo = {
    name: '',
    phone: '',
    email: '',
};

const WISHLIST_STORAGE_KEY = 'chocoSmileyWishlist';
const CART_STORAGE_KEY = 'chocoSmileyCart';

export type OrderItem = {
  name: string;
  quantity: number;
  flavours?: string[];
  mrp?: number;
  finalProductPrice?: number;
  finalSubtotal?: number;
  coverImage?: string;
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
  addOrder: (newOrder: Omit<Order, 'id'>) => Promise<string | null>;
  isOrdersLoaded: boolean;
  clearOrders: () => void;
  reorder: (orderId: string) => void;
  reorderItem: (item: OrderItem) => void;

  cart: Cart;
  updateCart: (productName: string, quantity: number, flavours?: string[]) => void;
  clearCart: () => void;
  isCartLoaded: boolean;

  isAuthenticated: boolean;
  user: User | null;
  login: (user: User, isNewUser: boolean) => void;
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
  
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(defaultProfileInfo);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  const [likedProducts, setLikedProducts, isWishlistLoaded] = useLocalStorage<Record<string, boolean>>(
    WISHLIST_STORAGE_KEY,
    {}
  );
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoaded, setIsOrdersLoaded] = useState(false);


  const [cart, setCart, isCartLoaded] = useLocalStorage<Cart>(
    CART_STORAGE_KEY,
    {}
  );

  const [authPopup, setAuthPopup] = useState<AuthPopupType>(null);
  const [flavourSelection, setFlavourSelection] = useState<{ product: SanityProduct | null; isOpen: boolean }>({ product: null, isOpen: false });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = getFirebaseAuth();
      if (auth) {
        const unsubscribe = onAuthStateChanged(async (newUser) => {
          setIsProfileLoaded(false);
          setUser(newUser);
          setIsAuthenticated(!!newUser);

          if (newUser) {
            let profile = await getUserProfile(newUser.uid);
            if (profile) {
              setProfileInfo(profile);
            }
            const userOrders = await getUserOrders(newUser.uid);
            setOrders(userOrders);
            setIsOrdersLoaded(true);
          } else {
            setProfileInfo(defaultProfileInfo);
            setOrders([]);
            setIsOrdersLoaded(true);
          }
          setIsProfileLoaded(true);
          setIsAuthLoaded(true);
        });
        return () => unsubscribe();
      } else {
        setIsAuthLoaded(true);
        setIsProfileLoaded(true);
        setIsOrdersLoaded(true);
      }
    }
  }, []);

  const updateProfileInfo = useCallback(async (newInfo: Partial<ProfileInfo>) => {
    if (user) {
      try {
        await updateUserProfile(user.uid, newInfo);
        setProfileInfo(prev => ({ ...prev, ...newInfo }));
      } catch (e) {
        console.error("Error updating profile in Firestore:", e);
        toast({
          title: "Error",
          description: "Could not save profile changes.",
          variant: "destructive"
        });
      }
    }
  }, [user, toast]);

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

  const addOrder = useCallback(async (newOrder: Omit<Order, 'id'>): Promise<string | null> => {
    if (user) {
      try {
        const newOrderId = await addUserOrder(user.uid, newOrder);
        setOrders(prevOrders => [{ ...newOrder, id: newOrderId }, ...prevOrders]);
        return newOrderId;
      } catch (error) {
        console.error("Error adding order:", error);
        toast({
          title: "Order Failed",
          description: "There was a problem saving your order. Please try again.",
          variant: "destructive"
        });
        return null;
      }
    }
    return null;
  }, [user, toast]);

  const clearOrders = useCallback(() => {
    // This should ideally also clear from Firestore, but for now we'll just clear local state.
    // A more robust implementation would call a server function.
    setOrders([]);
  }, []);

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
          newCart[item.name].quantity += item.quantity;
          const existingFlavours = newCart[item.name].flavours || [];
          const newFlavours = item.flavours || [];
          newCart[item.name].flavours = [...new Set([...existingFlavours, ...newFlavours])];
        } else {
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

   const reorderItem = useCallback((item: OrderItem) => {
    setCart(prevCart => {
        const newCart = { ...prevCart };
        if (newCart[item.name]) {
            newCart[item.name].quantity += item.quantity;
            const existingFlavours = newCart[item.name].flavours || [];
            const newFlavours = item.flavours || [];
            newCart[item.name].flavours = [...new Set([...existingFlavours, ...newFlavours])];
        } else {
            newCart[item.name] = { ...item };
        }
        return newCart;
    });
    toast({
        title: "Item Added to Cart",
        description: `${item.quantity} x ${item.name} has been added to your cart.`,
        variant: "success",
    });
  }, [setCart, toast]);

  const clearCart = useCallback(() => {
    setCart({});
  }, [setCart]);

  const login = useCallback(async (loggedInUser: User, isNewUser: boolean) => {
    let profile = await getUserProfile(loggedInUser.uid);
    let needsDetails = false;

    if (isNewUser || !profile) {
      profile = {
        name: loggedInUser.displayName || '',
        email: loggedInUser.email || '',
        phone: loggedInUser.phoneNumber || '',
      };
      await createUserProfile(loggedInUser.uid, profile);
      needsDetails = true;
    } else {
      if (!profile.name || !profile.phone) {
        needsDetails = true;
      }
    }
    
    setProfileInfo(profile);
    setAuthPopup(null); // Close login/signup popup immediately

    if (needsDetails) {
       // Use a timeout to ensure the state update for closing the first popup has rendered
      setTimeout(() => {
        setAuthPopup('completeDetails');
      }, 50);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutUser();
      setAuthPopup(null); 
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
    reorderItem,
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
