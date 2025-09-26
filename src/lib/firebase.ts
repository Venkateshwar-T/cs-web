
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
  type User
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    getDocs,
    query,
    collectionGroup,
    where,
    writeBatch,
    serverTimestamp,
    deleteField,
    onSnapshot,
    type Unsubscribe,
    limit,
    startAfter,
    orderBy,
    QueryDocumentSnapshot,
    DocumentData
} from 'firebase/firestore';
import type { ProfileInfo } from '@/context/app-context';
import type { Order } from '@/types';


// Initialize Firebase on the client side
function getClientApp(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    return null; // Don't initialize on the server
  }

  if (getApps().length) {
    return getApp();
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

   // Check if all required config values are present
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId
  ) {
    console.error("Firebase config is missing or invalid. Make sure all NEXT_PUBLIC_FIREBASE_ variables are set in your environment.");
    return null;
  }

  return initializeApp(firebaseConfig);
}

function getClientAuth() {
  const app = getClientApp();
  return app ? getAuth(app) : null;
}

function getClientFirestore() {
    const app = getClientApp();
    return app ? getFirestore(app) : null;
}


export const signInWithGoogle = () => {
  const auth = getClientAuth();
  if (!auth) throw new Error("Firebase auth not initialized");
  const googleProvider = new GoogleAuthProvider();
  return signInWithPopup(auth, googleProvider);
};

export const signUpWithEmail = (email: string, password: string) => {
  const auth = getClientAuth();
  if (!auth) throw new Error("Firebase auth not initialized");
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email: string, password: string) => {
  const auth = getClientAuth();
  if (!auth) throw new Error("Firebase auth not initialized");
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  const auth = getClientAuth();
  if (!auth) throw new Error("Firebase auth not initialized");
  return signOut(auth);
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  const auth = getClientAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onFirebaseAuthStateChanged(auth, callback);
};

export const updateUserPassword = (newPassword: string) => {
  const auth = getClientAuth();
  if (!auth?.currentUser) {
    throw new Error("User not authenticated.");
  }
  return updatePassword(auth.currentUser, newPassword);
};

export const sendPasswordReset = (email: string) => {
  const auth = getClientAuth();
  if (!auth) throw new Error("Firebase auth not initialized");
  return sendPasswordResetEmail(auth, email);
};

export function getFirebaseAuth() {
    return getClientAuth();
}

// Firestore user profile functions
export const getUserProfile = async (uid: string): Promise<ProfileInfo | null> => {
    const db = getClientFirestore();
    if (!db) return null;
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        return userDocSnap.data() as ProfileInfo;
    }
    return null;
};

export const createUserProfile = async (uid: string, data: ProfileInfo): Promise<void> => {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore not initialized");
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data);
};

export const updateUserProfile = async (uid: string, data: Partial<ProfileInfo>): Promise<void> => {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore not initialized");
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, data);
};

export const addUserOrder = async (uid: string, orderData: Omit<Order, 'id' | 'uid'>): Promise<string> => {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore not initialized");
    const ordersCollectionRef = collection(db, 'users', uid, 'orders');
    const docRef = await addDoc(ordersCollectionRef, {
        ...orderData,
        uid: uid,
        id: '' // Firestore will generate an ID, we'll update it later
    });
    // Now update the document with its own ID and a server-side timestamp
    await updateDoc(docRef, { id: docRef.id, date: serverTimestamp() });
    return docRef.id;
};


export const onUserOrdersSnapshotPaginated = (
  uid: string,
  callback: (orders: Order[], lastVisible: QueryDocumentSnapshot<DocumentData> | null) => void
): Unsubscribe => {
  const db = getClientFirestore();
  if (!db) return () => {};
  const ordersCollectionRef = collection(db, 'users', uid, 'orders');
  const q = query(
    ordersCollectionRef,
    orderBy('date', 'desc'),
    limit(5)
  );

  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => doc.data() as Order);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    callback(orders, lastVisible);
  });
};

export const getMoreUserOrders = async (
  uid: string,
  startAfterDoc: QueryDocumentSnapshot<DocumentData>
): Promise<{ orders: Order[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  const db = getClientFirestore();
  if (!db) return { orders: [], lastVisible: null };

  const ordersCollectionRef = collection(db, 'users', uid, 'orders');
  const q = query(
    ordersCollectionRef,
    orderBy('date', 'desc'),
    startAfter(startAfterDoc),
    limit(5)
  );

  const querySnapshot = await getDocs(q);
  const orders = querySnapshot.docs.map(doc => doc.data() as Order);
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { orders, lastVisible };
};


export const onAllOrdersSnapshot = (
  callback: (orders: Order[], lastVisible: QueryDocumentSnapshot<DocumentData> | null) => void
): Unsubscribe => {
  const db = getClientFirestore();
  if (!db) return () => {};

  const ordersQuery = query(
      collectionGroup(db, 'orders'), 
      orderBy('date', 'desc'), 
      limit(5)
  );

  return onSnapshot(ordersQuery, async (querySnapshot) => {
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      const ordersWithUserDetails = await Promise.all(
          querySnapshot.docs.map(async (orderDoc) => {
              const orderData = orderDoc.data() as Omit<Order, 'id'>;
              const userDocRef = orderDoc.ref.parent.parent;
              if (userDocRef) {
                  const userDocSnap = await getDoc(userDocRef);
                  if (userDocSnap.exists()) {
                      const userData = userDocSnap.data() as ProfileInfo;
                      return {
                          ...orderData,
                          id: orderDoc.id,
                          uid: userDocRef.id,
                          customerName: userData.name,
                          customerEmail: userData.email,
                          customerPhone: userData.phone,
                          address: userData.address
                      } as Order;
                  }
              }
              return { ...orderData, id: orderDoc.id, uid: userDocRef?.id || '' } as Order;
          })
      );
      callback(ordersWithUserDetails, lastVisible);
  });
};

export const getMoreOrders = async (startAfterDoc: QueryDocumentSnapshot<DocumentData>): Promise<{ orders: Order[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
    const db = getClientFirestore();
    if (!db) return { orders: [], lastVisible: null };

    const ordersQuery = query(
        collectionGroup(db, 'orders'),
        orderBy('date', 'desc'),
        startAfter(startAfterDoc),
        limit(5)
    );

    const querySnapshot = await getDocs(ordersQuery);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    const ordersWithUserDetails = await Promise.all(
        querySnapshot.docs.map(async (orderDoc) => {
            const orderData = orderDoc.data() as Omit<Order, 'id'>;
            const userDocRef = orderDoc.ref.parent.parent;
            if (userDocRef) {
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data() as ProfileInfo;
                    return {
                        ...orderData,
                        id: orderDoc.id,
                        uid: userDocRef.id,
                        customerName: userData.name,
                        customerEmail: userData.email,
                        customerPhone: userData.phone,
                        address: userData.address
                    } as Order;
                }
            }
            return { ...orderData, id: orderDoc.id, uid: userDocRef?.id || '' } as Order;
        })
    );
    
    return { orders: ordersWithUserDetails, lastVisible };
};


export const updateOrderStatus = async (uid: string, orderId: string, newStatus: Order['status'], cancelledBy?: 'user' | 'admin'): Promise<void> => {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore not initialized");

    if (!uid) {
      throw new Error("User ID is missing, cannot update order status.");
    }
    
    const orderDocRef = doc(db, 'users', uid, 'orders', orderId);
    
    const updateData: { status: Order['status'], cancelledBy?: 'user' | 'admin' | any } = { status: newStatus };

    if (newStatus === 'Cancelled' && cancelledBy) {
        updateData.cancelledBy = cancelledBy;
    } else if (newStatus !== 'Cancelled') {
        // Remove the cancelledBy field if status is changing away from Cancelled
        updateData.cancelledBy = deleteField();
    }

    await updateDoc(orderDocRef, updateData);
};

export const rateOrder = async (uid: string, orderId: string, rating: number, feedback: string): Promise<void> => {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore not initialized");

    if (!uid) {
      throw new Error("User ID is missing, cannot rate order.");
    }

    const orderDocRef = doc(db, 'users', uid, 'orders', orderId);
    await updateDoc(orderDocRef, {
        rating: rating,
        feedback: feedback
    });
};

export const addCancellationReason = async (uid: string, orderId: string, reason: string): Promise<void> => {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore not initialized");

    if (!uid) {
        throw new Error("User ID is missing, cannot add cancellation reason.");
    }

    const orderDocRef = doc(db, 'users', uid, 'orders', orderId);
    await updateDoc(orderDocRef, {
        cancellationReason: reason,
    });
};
