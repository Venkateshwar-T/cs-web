// @/components/ui/auth-layout.tsx
import Image from "next/image"
import { X } from "lucide-react"
import { DialogClose } from "@radix-ui/react-dialog"

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-custom-purple-dark text-white rounded-3xl text-center relative">
            <DialogClose asChild>
                <button className="absolute top-4 right-4 text-white hover:text-gray-300">
                     <Image src="/icons/cross_button.png" alt="Close" width={20} height={20} />
                </button>
            </DialogClose>
            <div className="pt-8 pb-4">
                <Image 
                    src="/Choco Smiley Logo.png" 
                    alt="Choco Smiley Logo" 
                    width={180} 
                    height={70}
                    className="mx-auto w-40"
                />
            </div>
            {children}
        </div>
    )
}
