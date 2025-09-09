
// @/app/faq/page.tsx
'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { SparkleBackground } from '@/components/sparkle-background';
import { Footer } from '@/components/footer';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ActiveView } from '@/app/page';
import { FaqContent } from '@/components/faq-content';

// The page wrapper is now a Client Component to handle interactive elements.
export default function FaqPage() {
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/${view}`);
  }

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className="flex flex-col h-screen">
        <Header
          onProfileOpenChange={() => {}}
          isContentScrolled={isMobile}
          onReset={() => router.push('/')}
          onNavigate={handleHeaderNavigate}
          activeView={'faq'}
        />
        <main className={cn(
          "flex-grow flex flex-col overflow-y-auto no-scrollbar transition-all duration-300",
          isMobile ? "pt-24" : "pt-36"
        )}>
          <Suspense fallback={<div className="flex-grow flex items-center justify-center"><p className="text-white text-center">Loading FAQs...</p></div>}>
            <FaqContent />
          </Suspense>
          <Footer />
        </main>
      </div>
    </>
  );
}
