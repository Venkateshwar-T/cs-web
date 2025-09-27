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
  onUserOrdersSnapshotPaginated,
  getMoreUserOrders,
  onAllOrdersSnapshot,
  updateOrderStatus,
  rateOrder as rateOrderInDb,
  addCancellationReason,
  getMoreOrders,
} from '@/lib/firebase';
import type { User } from 'firebase/auth';
import type { Order } from '@/types';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export type CartItem = {
  name: string;
  quantity: number;
  flavours?: string[];
};

const defaultProfileInfo: ProfileInfo = {
    name: '',
    phone: '',
    email: '',
    address: '',
};

const WISHLIST_STORAGE_KEY = 'chocoSmileyWishlist';
const CART_STORAGE_KEY = 'chocoSmileyCart';

export type OrderItem = {
  name: string;
  quantity: number;
  flavours?: { name: string, price: number }[];
  mrp?: number;
  finalProductPrice?: number;
  finalSubtotal?: number;
  coverImage?: string;
};

export type Cart = Record<string, CartItem>;
type AuthPopupType = 'login' | 'signup' | 'completeDetails' | 'forgotPassword' | null;

interface AppContextType {
  profileInfo: ProfileInfo;
  updateProfileInfo: (newInfo: Partial<ProfileInfo>) => void;
  isProfileLoaded: boolean;
  
  likedProducts: Record<string, boolean>;
  toggleLike: (productId: string) => void;
  clearWishlist: () => void;
  
  orders: Order[];
  isOrdersLoaded: boolean;
  loadMoreUserOrders: () => Promise<void>;
  hasMoreUserOrders: boolean;
  // This is the line we are correcting
  addOrder: (newOrder: Omit<Order, 'id' | 'uid' | 'date'>) => Promise<string | null>;
  clearOrders: () => void;
  reorder: (orderId: string) => void;
  reorderItem: (item: OrderItem) => void;
  rateOrder: (uid: string, orderId: string, rating: number, feedback: string) => void;
  saveCancellationReason: (uid: string, orderId: string, reason: string) => void;
  
  allOrders: Order[];
  isAllOrdersLoaded: boolean;
  loadMoreOrders: () => Promise<void>;
  hasMoreOrders: boolean;
  updateOrderStatus: (uid: string, orderId: string, newStatus: Order['status'], cancelledBy?: 'user' | 'admin') => Promise<void>;

  cart: Cart;
  updateCart: (productName: string, quantity: number, flavours?: string[]) => void;
  clearCart: () => void;
  isCartLoaded: boolean;

  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (user: User, isNewUser: boolean) => void;
  logout: () => void;
  authPopup: AuthPopupType;
  setAuthPopup: (popup: AuthPopupType) => void;

  flavourSelection: {
    product: SanityProduct | null;
    isOpen: boolean;
  };
  setFlavourSelection: (selection: { product: SanityProduct | null; isOpen: boolean }) => void;
  
  isGlobalLoading: boolean;
  setIsGlobalLoading: (isLoading: boolean) => void;
}

export type ProfileInfo = {
    name: string;
    phone: string;
    email: string;
    address: string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>(defaultProfileInfo);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  const [likedProducts, setLikedProducts, isWishlistLoaded] = useLocalStorage<Record<string, boolean>>(
    WISHLIST_STORAGE_KEY,
    {}
  );
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoaded, setIsOrdersLoaded] = useState(false);
  const [lastUserOrderSnapshot, setLastUserOrderSnapshot] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreUserOrders, setHasMoreUserOrders] = useState(true);

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isAllOrdersLoaded, setIsAllOrdersLoaded] = useState(false);
  const [lastOrderSnapshot, setLastOrderSnapshot] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);


  const [cart, setCart, isCartLoaded] = useLocalStorage<Cart>(
    CART_STORAGE_KEY,
    {}
  );

  const [authPopup, setAuthPopup] = useState<AuthPopupType>(null);
  const [flavourSelection, setFlavourSelection] = useState<{ product: SanityProduct | null; isOpen: boolean }>({ product: null, isOpen: false });
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let unsubscribeUserOrders = () => {};
    let unsubscribeAllOrders = () => {};

    const unsubscribeFromAuth = onAuthStateChanged(async (newUser) => {
        setIsProfileLoaded(false);
        setUser(newUser);
        const newIsAdmin = newUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        setIsAuthenticated(!!newUser);
        setIsAdmin(newIsAdmin);

        unsubscribeUserOrders();
        unsubscribeAllOrders();

        if (newUser) {
            let profile = await getUserProfile(newUser.uid);
            if (profile) {
                setProfileInfo(profile);
            }
            
            unsubscribeUserOrders = onUserOrdersSnapshotPaginated(newUser.uid, (initialUserOrders, lastVisible) => {
                setOrders(initialUserOrders);
                setLastUserOrderSnapshot(lastVisible);
                setHasMoreUserOrders(initialUserOrders.length === 5);
                setIsOrdersLoaded(true);
            });

            if (newIsAdmin) {
                unsubscribeAllOrders = onAllOrdersSnapshot((initialOrders, lastVisible) => {
                    const sortedOrders = initialOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setAllOrders(sortedOrders);
                    setLastOrderSnapshot(lastVisible);
                    setHasMoreOrders(initialOrders.length === 5); // Set to 5
                    setIsAllOrdersLoaded(true);
                });
            } else {
                setAllOrders([]);
                setIsAllOrdersLoaded(true);
            }
        } else {
            setProfileInfo(defaultProfileInfo);
            setOrders([]);
            setAllOrders([]);
            setIsOrdersLoaded(true);
            setIsAllOrdersLoaded(true);
        }
        setIsProfileLoaded(true);
        setIsAuthLoaded(true);
    });

    return () => {
        unsubscribeFromAuth();
        unsubscribeUserOrders();
        unsubscribeAllOrders();
    };
  }, []);
  
  const loadMoreUserOrders = useCallback(async () => {
    if (!user || !lastUserOrderSnapshot || !hasMoreUserOrders) return;

    const { orders: newOrders, lastVisible } = await getMoreUserOrders(user.uid, lastUserOrderSnapshot);
    setOrders(prevOrders => [...prevOrders, ...newOrders]);
    setLastUserOrderSnapshot(lastVisible);
    setHasMoreUserOrders(newOrders.length === 5);
  }, [user, lastUserOrderSnapshot, hasMoreUserOrders]);

  const loadMoreOrders = useCallback(async () => {
    if (!lastOrderSnapshot || !hasMoreOrders) return;

    const { orders: newOrders, lastVisible } = await getMoreOrders(lastOrderSnapshot);
    setAllOrders(prevOrders => [...prevOrders, ...newOrders]);
    setLastOrderSnapshot(lastVisible);
    setHasMoreOrders(newOrders.length === 5); // Set to 5
  }, [lastOrderSnapshot, hasMoreOrders]);
  
  useEffect(() => {
    // This is now only for debugging or specific cases, as the progress bar is automatic
  }, [isGlobalLoading]);


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

  const addOrder = useCallback(async (newOrder: Omit<Order, 'id' | 'uid' | 'date'>): Promise<string | null> => {
    if (user) {
      try {
        const newOrderId = await addUserOrder(user.uid, newOrder);
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
        const itemFlavours = item.flavours?.map(f => f.name) || [];
        if (newCart[item.name]) {
          newCart[item.name].quantity += item.quantity;
          const existingFlavours = newCart[item.name].flavours || [];
          newCart[item.name].flavours = [...new Set([...existingFlavours, ...itemFlavours])];
        } else {
          newCart[item.name] = { 
            name: item.name,
            quantity: item.quantity,
            flavours: itemFlavours,
          };
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
        const itemFlavours = item.flavours?.map(f => f.name) || [];
        if (newCart[item.name]) {
            newCart[item.name].quantity += item.quantity;
            const existingFlavours = newCart[item.name].flavours || [];
            newCart[item.name].flavours = [...new Set([...existingFlavours, ...itemFlavours])];
        } else {
            newCart[item.name] = { 
              name: item.name,
              quantity: item.quantity,
              flavours: itemFlavours
            };
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
        address: '',
      };
      await createUserProfile(loggedInUser.uid, profile);
      needsDetails = true;
    } else {
      if (!profile.name || !profile.phone || !profile.address) {
        needsDetails = true;
      }
    }
    
    setProfileInfo(profile);
    setAuthPopup(null);

    if (needsDetails) {
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
  
  const handleUpdateOrderStatus = async (uid: string, orderId: string, newStatus: Order['status'], cancelledBy?: 'user' | 'admin'): Promise<void> => {
    try {
      await updateOrderStatus(uid, orderId, newStatus, cancelledBy);
      toast({
        title: "Status Updated",
        description: `Order ${orderId} marked as ${newStatus}.`,
        variant: 'success'
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the order status.",
        variant: 'destructive'
      });
    }
  };
  
  const rateOrder = async (uid: string, orderId: string, rating: number, feedback: string) => {
    try {
      await rateOrderInDb(uid, orderId, rating, feedback);
    } catch (error) {
      console.error("Failed to rate order:", error);
      toast({
        title: "Rating Failed",
        description: "Could not submit your feedback.",
        variant: 'destructive'
      });
    }
  };

  const saveCancellationReason = async (uid: string, orderId: string, reason: string) => {
    try {
        const reasonToSave = reason === 'SKIPPED' ? 'Feedback not provided by customer.' : reason;
        await addCancellationReason(uid, orderId, reasonToSave);
    } catch (error) {
        console.error("Failed to save cancellation reason:", error);
        toast({
            title: "Feedback Failed",
            description: "Could not save your cancellation reason.",
            variant: 'destructive'
        });
    }
  };


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
    loadMoreUserOrders,
    hasMoreUserOrders,
    clearOrders,
    reorder,
    reorderItem,
    rateOrder,
    saveCancellationReason,
    allOrders,
    isAllOrdersLoaded,
    loadMoreOrders,
    hasMoreOrders,
    updateOrderStatus: handleUpdateOrderStatus,
    cart,
    updateCart,
    clearCart,
    isCartLoaded,
    isAuthenticated,
    user,
    isAdmin,
    login,
    logout,
    authPopup,
    setAuthPopup,
    flavourSelection,
    setFlavourSelection,
    isGlobalLoading,
    setIsGlobalLoading,
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

export const AppContextConsumer = AppContext.Consumer;
