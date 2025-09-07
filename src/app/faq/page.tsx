
// @/app/faq/page.tsx
'use client';

import { useState, UIEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { SparkleBackground } from '@/components/sparkle-background';
import { Footer } from '@/components/footer';
import { FaqView } from '@/components/faq-view';
import type { ActiveView, ProfileInfo } from '@/app/page';
import { useCart } from '@/hooks/use-cart';
import { PopupsManager } from '@/components/popups/popups-manager';
import { BottomNavbar } from '@/components/bottom-navbar';


export default function FaqPage() {
    const router = useRouter();
    const { cart, updateCart, clearCart } = useCart();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
        name: 'John Doe',
        phone: '+1 234 567 890',
        email: 'john.doe@example.com',
    });
    const [isContentScrolled, setIsContentScrolled] = useState(false);

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop } = event.currentTarget;
      setIsContentScrolled(scrollTop > 0);
    };

    const handleNavigation = (view: ActiveView) => {
        if (view === 'home') router.push('/');
        else if (view === 'cart') router.push('/cart');
        else if (view === 'profile') router.push('/profile');
        else if (view === 'about') router.push('/about');
    };

    const handleHeaderNavigate = (view: 'about' | 'faq') => {
        router.push(`/${view}`);
    }

    const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

    return (
        <>
            <SparkleBackground />
            <div className="flex flex-col h-screen">
                <Header
                  onProfileOpenChange={setIsProfileOpen}
                  isContentScrolled={isContentScrolled}
                  onReset={() => router.push('/')}
                  onNavigate={handleHeaderNavigate}
                  activeView={'faq'}
                  onSearchSubmit={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
                  searchInput={searchInput}
                  onSearchInputChange={setSearchInput}
                  isSearchingOnAbout={true}
                />
                <main onScroll={handleScroll} className="flex-grow pt-36 flex flex-col overflow-y-auto no-scrollbar">
                    <FaqView />
                    <Footer />
                </main>
            </div>

             <PopupsManager
                selectedProduct={null}
                isCartVisible={false}
                isCartOpen={false}
                isProfileOpen={isProfileOpen}
                isSignUpOpen={false}
                isCompleteDetailsOpen={false}
                onClosePopup={() => {}}
                onImageExpandChange={() => {}}
                likedProducts={{}}
                onLikeToggle={() => {}}
                cart={cart}
                onAddToCart={updateCart}
                onToggleCartPopup={() => {}}
                onClearCart={clearCart}
                onFinalizeOrder={() => {}}
                onProfileUpdate={(info) => setProfileInfo(p => ({...p, ...info}))}
                profileInfo={profileInfo}
                allProducts={[]}
                onClearWishlist={() => {}}
                setIsProfileOpen={setIsProfileOpen}
                setIsSignUpOpen={() => {}}
                onLoginClick={() => {}}
                setIsCompleteDetailsOpen={() => {}}
                onConfirmOrder={() => {}}
            />
            <BottomNavbar activeView={'faq'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
        </>
    );
}
