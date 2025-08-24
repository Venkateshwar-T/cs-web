// @/components/signup-popup.tsx
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

interface SignUpPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLoginClick: () => void;
}

export function SignUpPopup({ open, onOpenChange, onLoginClick }: SignUpPopupProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 w-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Sign Up</DialogTitle>
        </DialogHeader>
        <AuthLayout>
            <div className="flex flex-col gap-4 px-8 pb-8 w-96">
                <h2 className="text-3xl font-medium text-white font-plex-sans self-start">Sign Up</h2>
                
                <div className="space-y-1 text-left">
                    <label className="text-sm text-white font-plex-sans">Email or Phone</label>
                    <Input 
                        placeholder="Enter your email or phone"
                        className="bg-white rounded-full text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-12"
                    />
                </div>
                
                <div className="space-y-1 text-left">
                    <label className="text-sm text-white font-plex-sans">Password</label>
                    <Input 
                        type="password"
                        placeholder="Enter your password"
                        className="bg-white rounded-full text-black placeholder:text-gray-400 placeholder:font-montserrat font-montserrat h-12"
                    />
                </div>

                <p className="text-xs text-white font-montserrat self-center text-center">
                    By continuing, you agree to Choco Smiley’s <a href="#" className="text-custom-gold hover:underline">Terms and Service</a> and acknowledge Choco Smiley’s <a href="#" className="text-custom-gold hover:underline">Privacy Policy</a>.
                </p>

                <Button className="w-full h-12 bg-custom-gold text-custom-purple-dark font-montserrat font-bold text-lg rounded-full hover:bg-custom-gold/90 mt-2">
                    Create Account
                </Button>

                <div className="flex items-center gap-2 my-2">
                    <div className="h-px flex-grow bg-white/50"></div>
                    <span className="text-white text-sm">OR</span>
                    <div className="h-px flex-grow bg-white/50"></div>
                </div>

                <Button variant="outline" className="w-[60%] h-12 bg-white font-semibold text-black self-center rounded-full hover:bg-white/90 hover:text-black/90">
                    <Image src="/icons/google.png" alt="Google" width={25} height={25} />
                    Sign up with Google
                </Button>
                
                <p className="text-center text-sm text-white font-plex-sans mt-4">
                    Already Have an Account? <button onClick={onLoginClick} className="font-bold text-custom-gold hover:underline">Log In</button>
                </p>
            </div>
        </AuthLayout>
      </DialogContent>
    </Dialog>
  )
}
