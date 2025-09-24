
// @/app/admin/page.tsx
import { Suspense } from 'react';
import AdminClientPage from './admin-client-page';
import { Loader } from '@/components/loader';
import Image from 'next/image';

const LoadingFallback = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Image src="/Choco Smiley Logo.png" alt="Choco Smiley" width={180} height={70} />
            <Loader />
        </div>
    </div>
);

export default function AdminPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AdminClientPage />
        </Suspense>
    );
}
