
// @/components/progress-bar.tsx
'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

export function ProgressBarComponent() {
  useRouter();

  return (
    <Suspense fallback={null}>
      <ProgressBar
        height="4px"
        color="#FFD139"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </Suspense>
  );
}
