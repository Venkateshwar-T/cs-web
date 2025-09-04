
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActiveView, ProfileInfo } from '@/app/page';
import { Header } from '@/components/header';
import { BottomNavbar } from '@/components/bottom-navbar';
import { SparkleBackground } from '@/components/sparkle-background';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProfileMobileView } from '@/components/profile-mobile-view';

export default function ProfilePage() {
  const [activeView, setActiveView] = useState<ActiveView>('profile');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const { cart } = useCart();
  const isMobile = useIsMobile();
  
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: 'John Doe',
    phone: '+1 234 567 890',
    email: 'john.doe@example.com',
  });

  const handleNavigation = (view: ActiveView) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'cart') {
      router.push('/cart');
    }
    // If view is 'profile', do nothing as we are already on the page.
  };

  const handleHeaderNavigate = (view: 'about' | 'faq') => {
    router.push(`/?view=${view}`);
  }

  const handleProfileUpdate = (updatedProfile: Partial<ProfileInfo>) => {
    setProfileInfo(prev => ({ ...prev, ...updatedProfile }));
  };

  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  return (
    <>
      <SparkleBackground />
      <div className="flex flex-col h-screen">
        <Header
          onProfileOpenChange={setIsProfileOpen}
          isContentScrolled={false}
          onReset={() => router.push('/')}
          onNavigate={handleHeaderNavigate}
          activeView={'profile'}
          isUsingAnimatedSearch={false}
        />
        <main className={cn(
          "flex-grow flex flex-col transition-all duration-300 relative min-h-0 md:pb-0",
          "pt-24" 
        )}>
          {isMobile ? (
            <ProfileMobileView 
              profile={profileInfo}
              onProfileUpdate={handleProfileUpdate}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
              <h2 className="text-2xl font-bold text-white">Desktop Profile View</h2>
              <p className="text-white/70 max-w-xs">
                This is a placeholder for the desktop profile view.
              </p>
            </div>
          )}
        </main>
        <BottomNavbar activeView={activeView} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
      </div>
    </>
  );
}
