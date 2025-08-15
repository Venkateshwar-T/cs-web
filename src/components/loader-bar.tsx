'use client';

import { cn } from '@/lib/utils';

interface LoaderBarProps {
  isLoading: boolean;
  onAnimationComplete: () => void;
}

export function LoaderBar({ isLoading, onAnimationComplete }: LoaderBarProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden">
      <div
        className={cn(
          'h-full bg-custom-gold animate-loader-bar'
        )}
        onAnimationEnd={onAnimationComplete}
      ></div>
    </div>
  );
}
