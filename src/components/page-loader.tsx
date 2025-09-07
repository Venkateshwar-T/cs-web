// @/components/page-loader.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, [pathname]);

  const onAnimationEnd = () => {
    setLoading(false);
  };
  
  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[999] overflow-hidden">
      <div
        className={cn(
          'h-full bg-custom-gold origin-left'
        )}
        style={{ animation: 'page-loader-bar 1.5s ease-out forwards' }}
        onAnimationEnd={onAnimationEnd}
      ></div>
    </div>
  );
}
