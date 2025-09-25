// @/app/admin/analytics/analytics-client-page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { SparkleBackground } from '@/components/sparkle-background';
import { useIsMobile } from '@/hooks/use-mobile';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { useAppContext } from '@/context/app-context';
import type { SanityProduct } from '@/types';
import { Loader } from '@/components/loader';
import { EmptyState } from '@/components/empty-state';

export default function AnalyticsClientPage({ allProducts }: { allProducts: SanityProduct[] }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { isAllOrdersLoaded, isAdmin } = useAppContext();

  if (!isAllOrdersLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  if (!isAdmin) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
         <EmptyState
            imageUrl="/icons/profile_drpdwn_btn.png"
            title="Access Denied"
            description="You do not have permission to view this page."
            buttonText="Go to Homepage"
            onButtonClick={() => router.push('/')}
            imageClassName='w-24 h-24'
          />
      </div>
    )
  }

  return (
    <>
      {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
      <div className={cn("flex flex-col h-screen")}>
        <Header
          onProfileOpenChange={() => {}}
          isContentScrolled={true}
          onReset={() => router.push('/')}
          onNavigate={(view) => router.push(`/${view}`)}
          activeView={'admin'}
        />
        <main className={cn(
          "flex-grow flex flex-col transition-all duration-300 relative min-h-0",
          "pt-24 md:pt-32" 
        )}>
          <div className="px-4 md:px-16 lg:px-32 flex-grow flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Analytics Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder for Key Metrics */}
                <div className="bg-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-semibold text-white mb-2">Key Metrics</h2>
                    <p className="text-white/70">Total Revenue, Average Order Value, etc.</p>
                </div>

                {/* Placeholder for Sales Trends */}
                <div className="bg-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-semibold text-white mb-2">Sales Trends</h2>
                    <p className="text-white/70">Chart showing sales over time.</p>
                </div>

                {/* Placeholder for Order Status */}
                <div className="bg-white/10 p-6 rounded-2xl">
                    <h2 className="text-lg font-semibold text-white mb-2">Order Status Overview</h2>
                    <p className="text-white/70">Pie chart of order statuses.</p>
                </div>
            </div>
            
          </div>
        </main>
      </div>
    </>
  );
}
