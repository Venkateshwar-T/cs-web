
'use client';

import { ProgressBarComponent } from "@/components/progress-bar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <ProgressBarComponent />
      {children}
    </>
  );
}
