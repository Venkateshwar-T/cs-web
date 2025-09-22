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
  type User
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { ProfileInfo } from '@/context/app-context';


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
