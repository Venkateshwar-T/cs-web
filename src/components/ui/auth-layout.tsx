// @/components/ui/auth-layout.tsx
import Image from "next/image"

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-custom-purple-dark text-white text-center relative">
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
