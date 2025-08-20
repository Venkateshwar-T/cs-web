// @/components/login-popup.tsx
'use client';

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

interface LoginPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LoginPopup({ open, onOpenChange }: LoginPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none p-0 w-auto max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Login</DialogTitle>
        </DialogHeader>
        <AuthLayout>
            <div className="flex flex-col gap-4 px-8 pb-8">
                <h2 className="text-3xl font-bold text-white font-plex-sans self-start">Log In</h2>
                
                <div className="space-y-1 text-left">
                    <label className="text-sm text-white font-plex-sans">Email or Phone</label>
                    <Input 
                        placeholder="Enter your email or phone"
                        className="bg-white text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat"
                    />
                </div>
                
                <div className="space-y-1 text-left">
                    <label className="text-sm text-white font-plex-sans">Password</label>
                    <Input 
                        type="password"
                        placeholder="Enter your password"
                        className="bg-white text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat"
                    />
                </div>

                <a href="#" className="text-sm text-white font-montserrat self-end hover:underline">Forgot Password?</a>

                <Button className="w-full bg-custom-gold text-custom-purple-dark font-montserrat font-bold text-lg rounded-full hover:bg-custom-gold/90 mt-2">
                    Login
                </Button>

                <div className="flex items-center gap-2 my-2">
                    <div className="h-px flex-grow bg-white/50"></div>
                    <span className="text-white text-sm">OR</span>
                    <div className="h-px flex-grow bg-white/50"></div>
                </div>

                <Button variant="outline" className="w-full bg-white text-black rounded-full hover:bg-white/90">
                    <Image src="/icons/google.png" alt="Google" width={20} height={20} className="mr-2" />
                    Sign in with Google
                </Button>
                
                <p className="text-center text-sm text-white font-plex-sans mt-4">
                    Don’t Have an Account? <a href="#" className="font-bold text-custom-gold hover:underline">Sign Up</a>
                </p>
            </div>
        </AuthLayout>
      </DialogContent>
    </Dialog>
  )
}
