
'use client';

import { useAppContext } from "@/context/app-context";
import { LoadingFallback } from "@/components/loading-fallback";
import { ProgressBarComponent } from "@/components/progress-bar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isGlobalLoading } = useAppContext();

  return (
    <>
      {isGlobalLoading && <LoadingFallback text="Searching..." />}
      <ProgressBarComponent />
      {children}
    </>
  );
}
