
// @/components/search-page-skeleton.tsx
'use client';

import { cn } from '@/lib/utils';
import { ProductCardSkeleton } from './product-card-skeleton';
import { Skeleton } from './ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileSkeleton = () => (
    <div className="flex flex-col h-screen bg-background">
        {/* Mobile Header Skeleton */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background h-16 flex items-center px-4 border-b border-white/20">
            <div className="w-full">
                <Skeleton className="h-10 w-full rounded-full bg-white/20" />
            </div>
        </header>

        <main className="flex-grow flex flex-col transition-all duration-300 relative min-h-0 pt-16">
            <div className="flex w-full items-start h-full flex-grow min-h-0">
                <div className="h-full flex-grow relative min-h-0 w-full px-4">
                    <div className="bg-[#5D2B79] h-full rounded-t-[20px] relative mt-0 min-h-0 flex flex-col">
                        <div className="bg-white/20 h-full w-full rounded-t-[20px] pt-3 mt-3 flex flex-col">
                            {/* Mobile Header and Filters Skeleton */}
                            <div className="flex-shrink-0 px-4 pb-4">
                                <div>
                                    <div className="flex justify-between items-center text-white">
                                        <Skeleton className="h-5 w-40 bg-white/20" />
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-8 w-8 rounded-md bg-white/20" />
                                            <Skeleton className="h-8 w-8 rounded-md bg-white/20" />
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-white/20 my-4" />
                            </div>

                            {/* Scrollable grid skeleton */}
                            <div className="flex-grow h-full overflow-y-auto custom-scrollbar pt-0 pb-8 min-h-0 px-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        {/* Bottom Navbar Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-white/20 md:hidden z-50">
            <div className="flex justify-around items-center h-full">
                <Skeleton className="h-10 w-16 bg-white/20 rounded-md" />
                <Skeleton className="h-10 w-16 bg-white/20 rounded-md" />
                <Skeleton className="h-10 w-16 bg-white/20 rounded-md" />
            </div>
        </div>
    </div>
);

const DesktopSkeleton = () => (
    <div className="flex flex-col h-screen bg-background">
        {/* Desktop Header Skeleton */}
        <header className="fixed top-0 z-50 w-full pt-6 pb-4 bg-transparent">
            <div className="container relative flex h-16 max-w-screen-2xl items-center justify-between px-8 xl:px-24">
                <Skeleton className="h-10 w-48 bg-white/20" />
                <Skeleton className="h-11 w-96 rounded-full bg-white/20" />
                <Skeleton className="h-10 w-48 bg-white/20" />
            </div>
        </header>

        <main className="flex-grow flex flex-col transition-all duration-300 relative min-h-0 pt-32">
            <div className="flex w-full items-start h-full flex-grow min-h-0">
                {/* Filter Sidebar Skeleton */}
                <div className="hidden md:block w-full md:w-auto md:sticky md:top-0 md:w-[17%] h-full">
                     <div className="bg-custom-gray-dark shadow-custom-dark h-full w-full rounded-tr-[40px]">
                        <div className="bg-white/20 h-full w-full rounded-tr-[40px] p-8 space-y-8">
                            <Skeleton className="h-6 w-32 bg-white/20" />
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="h-5 w-24 bg-white/20" />
                                    <div className="space-y-3">
                                      {Array.from({ length: 3 }).map((_, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-4 bg-white/20" />
                                            <Skeleton className="h-4 w-28 bg-white/20" />
                                        </div>
                                      ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Search Results Skeleton */}
                <div className="h-full flex-grow md:ml-8 md:mr-8 relative min-h-0 w-full md:w-auto px-4 md:px-0">
                     <div className="bg-[#5D2B79] h-full rounded-t-[40px] relative mt-0 min-h-0 flex flex-col">
                        <div className="bg-white/20 h-full w-full rounded-t-[40px] pt-6 flex flex-col">
                            <div className="flex-shrink-0 px-8 pb-4">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-6 w-64 bg-white/20" />
                                    <Skeleton className="h-9 w-56 rounded-full bg-white/20" />
                                </div>
                            </div>
                            <div className="flex-grow h-full overflow-y-auto pt-4 pb-8 min-h-0 px-8">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                     {Array.from({ length: 12 }).map((_, index) => <ProductCardSkeleton key={index} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
);


export function SearchPageSkeleton() {
    const isMobile = useIsMobile();

    if (isMobile === undefined) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center text-white bg-background gap-4">
                {/* You can put a simple loader here for the brief moment before hydration */}
            </div>
        );
    }
    
    return isMobile ? <MobileSkeleton /> : <DesktopSkeleton />;
}
