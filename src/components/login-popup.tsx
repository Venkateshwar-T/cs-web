
// @/components/login-popup.tsx
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AuthLayout } from "./ui/auth-layout";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, signInWithEmail } from '@/lib/firebase';
import { useAppContext } from "@/context/app-context";
import { cn } from '@/lib/utils';

interface LoginPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSignUpClick: () => void;
}

export function LoginPopup({ open, onOpenChange, onSignUpClick }: LoginPopupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { login, setAuthPopup } = useAppContext();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast({ title: "Error", description: "Please enter email and password.", variant: "destructive" });
      return;
    }
    try {
      const userCredential = await signInWithEmail(email, password);
      login(userCredential.user);
      setAuthPopup(null);
      toast({ title: "Success", description: "Logged in successfully!", variant: "success" });
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithGoogle();
      login(userCredential.user);
      setAuthPopup(null);
      toast({ title: "Success", description: "Logged in successfully!", variant: "success" });
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("p-0 w-full max-w-sm md:max-w-md md:rounded-[40px] rounded-2xl")}>
        <DialogHeader>
          <DialogTitle className="sr-only">Login</DialogTitle>
        </DialogHeader>
        <AuthLayout>
            <div className="flex flex-col gap-4 p-6 md:px-8 pb-8 w-full">
                <h2 className="text-2xl md:text-3xl font-medium text-white font-plex-sans self-start">Log In</h2>
                
                <div className="space-y-1 text-left">
                    <label className="text-sm text-white font-plex-sans">Email or Phone</label>
                    <Input 
                        placeholder="Enter your email or phone"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                    />
                </div>
                
                <div className="space-y-1 text-left">
                    <label className="text-sm text-white font-plex-sans">Password</label>
                    <Input 
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                    />
                </div>

                <a href="#" className="text-sm text-white font-montserrat self-center hover:underline">Forgot Password?</a>

                <Button onClick={handleEmailLogin} className="w-full h-10 md:h-12 bg-custom-gold text-custom-purple-dark font-montserrat font-bold text-base md:text-lg rounded-full hover:bg-custom-gold/90 mt-2">
                    Login
                </Button>

                <div className="flex items-center gap-2 my-2">
                    <div className="h-px flex-grow bg-white/50"></div>
                    <span className="text-white text-sm">OR</span>
                    <div className="h-px flex-grow bg-white/50"></div>
                </div>

                <Button variant="outline" onClick={handleGoogleLogin} className="w-full md:w-[60%] h-10 md:h-12 bg-white font-semibold text-black self-center rounded-full hover:bg-white/90 hover:text-black/90 text-sm md:text-base">
                    <Image src="/icons/google.png" alt="Google" width={25} height={25} className="w-5 h-5 md:w-6 md:h-6" />
                    Sign in with Google
                </Button>
                
                <p className="text-center text-sm text-white font-plex-sans mt-4">
                    Don’t Have an Account? <button onClick={onSignUpClick} className="font-bold text-custom-gold hover:underline">Sign Up</button>
                </p>
            </div>
        </AuthLayout>
      </DialogContent>
    </Dialog>
  )
}
