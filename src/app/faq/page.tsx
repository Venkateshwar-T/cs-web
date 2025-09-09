// @/app/faq/page.tsx (The new file)

import { Suspense } from 'react';
import { FaqContent } from '@/components/faq-content';
import FaqPageClient from './faq-client-page'; // Import the client shell

export default function FaqPage() {
  return (
    // The Client Component wraps the Suspense and Server Component
    <FaqPageClient> 
      <Suspense fallback={<div className="flex-grow flex items-center justify-center"><p className="text-white text-center">Loading FAQs...</p></div>}>
        <FaqContent />
      </Suspense>
    </FaqPageClient>
  );
}