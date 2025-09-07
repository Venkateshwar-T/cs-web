// @/components/progress-bar.tsx
'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export function ProgressBarComponent() {
  return (
    <ProgressBar
      height="4px"
      color="#FFD139"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
