
// @/components/signup-popup.tsx
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
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase';
import { useAppContext } from "@/context/app-context";
import { cn } from '@/lib/utils';


interface SignUpPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLoginClick: () => void;
}

export function SignUpPopup({ open, onOpenChange, onLoginClick }: SignUpPopupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { login, setAuthPopup } = useAppContext();

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      toast({ title: "Error", description: "Please enter email and password.", variant: "destructive" });
      return;
    }
    try {
      const userCredential = await signUpWithEmail(email, password);
      login(userCredential.user);
      setAuthPopup('completeDetails');
      toast({ title: "Success", description: "Account created successfully!", variant: "success" });
    } catch (error: any) {
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const userCredential = await signInWithGoogle();
      login(userCredential.user);
      // Check if user has name and phone, if not, open complete details
      if (!userCredential.user.displayName) {
        setAuthPopup('completeDetails');
      } else {
        setAuthPopup(null);
      }
      toast({ title: "Success", description: "Logged in successfully!", variant: "success" });
    } catch (error: any) {
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("p-0 w-[90vw] md:w-full max-w-sm md:max-w-md rounded-2xl md:rounded-[40px]")}>
        <DialogHeader>
          <DialogTitle className="sr-only">Sign Up</DialogTitle>
        </DialogHeader>
        <AuthLayout>
            <div className="flex flex-col gap-2 md:gap-4 p-4 md:px-8 md:pb-8 w-full">
                <h2 className="text-xl md:text-3xl font-medium text-white font-plex-sans self-start">Sign Up</h2>
                
                <div className="space-y-1 text-left">
                    <label className="pl-2 text-xs md:text-sm text-white font-plex-sans">Email or Phone</label>
                    <Input 
                        placeholder="Enter your email or phone"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                    />
                </div>
                
                <div className="space-y-1 text-left">
                    <label className="pl-2 text-xs md:text-sm text-white font-plex-sans">Password</label>
                    <Input 
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white rounded-2xl text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-10 md:h-12"
                    />
                </div>

                <p className="text-[10px] md:text-xs text-white font-montserrat self-center text-center">
                    By continuing, you agree to Choco Smiley’s <a href="#" className="text-custom-gold hover:underline">Terms and Service</a> and acknowledge Choco Smiley’s <a href="#" className="text-custom-gold hover:underline">Privacy Policy</a>.
                </p>

                <Button onClick={handleEmailSignUp} className="w-full h-10 md:h-12 bg-custom-gold text-custom-purple-dark font-montserrat font-bold text-base md:text-lg rounded-full hover:bg-custom-gold/90 mt-1 md:mt-2">
                    Create Account
                </Button>

                <div className="flex items-center gap-2 my-1 md:my-2">
                    <div className="h-px flex-grow bg-white/50"></div>
                    <span className="text-white text-xs md:text-sm">OR</span>
                    <div className="h-px flex-grow bg-white/50"></div>
                </div>

                <Button variant="outline" onClick={handleGoogleSignUp} className="w-full md:w-[60%] h-10 md:h-12 bg-white font-semibold text-black self-center rounded-full hover:bg-white/90 hover:text-black/90 text-sm md:text-base gap-2 md:gap-3">
                    <Image src="/icons/google.png" alt="Google" width={25} height={25} className="w-5 h-5 md:w-6 md:h-6"/>
                    Sign up with Google
                </Button>
                
                <p className="text-center text-xs md:text-sm text-white font-plex-sans mt-2 md:mt-4">
                    Already Have an Account? <button onClick={onLoginClick} className="font-bold text-custom-gold hover:underline">Log In</button>
                </p>
            </div>
        </AuthLayout>
      </DialogContent>
    </Dialog>
  )
}
