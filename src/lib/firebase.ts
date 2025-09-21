// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  type User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AI_ADC_MARKER_FIREBASE_API_KEY",
  authDomain: "AI_ADC_MARKER_FIREBASE_AUTH_DOMAIN",
  projectId: "AI_ADC_MARKER_FIREBASE_PROJECT_ID",
  storageBucket: "AI_ADC_MARKER_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "AI_ADC_MARKER_FIREBASE_MESSAGING_SENDER_ID",
  appId: "AI_ADC_MARKER_FIREBASE_APP_ID"
};

// Initialize Firebase
const apps = getApps();
const app = !apps.length ? initializeApp(firebaseConfig) : apps[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return onFirebaseAuthStateChanged(auth, callback);
};

export { auth };
