
'use client';

import { ExploreCategories } from '@/components/explore-categories';
import { cn } from '@/lib/utils';

export function HomeView() {
  return (
    <div className={cn("transition-opacity duration-500 w-full h-full")}>
      <ExploreCategories />
    </div>
  );
}
