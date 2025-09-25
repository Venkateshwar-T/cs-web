// @/components/loading-fallback.tsx
import Image from 'next/image';
import { Loader } from '@/components/loader';

interface LoadingFallbackProps {
  text?: string;
}

export const LoadingFallback = ({ text = "Loading..." }: LoadingFallbackProps) => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Image src="/Choco Smiley Logo.png" alt="Choco Smiley" width={180} height={70} />
            <Loader />
            {text && <p className="text-white mt-2">{text}</p>}
        </div>
    </div>
);
