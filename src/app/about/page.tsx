
// @/app/about/page.tsx
'use client';

import { useState, UIEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from "@/components/header";
import { SparkleBackground } from '@/components/sparkle-background';
import { Footer } from '@/components/footer';
import { SectionTitle } from "@/components/section-title";
import { Heart, Leaf, Gift, Sparkles } from "lucide-react";
import type { ActiveView, ProfileInfo } from '@/app/page';
import { useCart } from '@/hooks/use-cart';
import { PopupsManager } from '@/components/popups/popups-manager';
import { BottomNavbar } from '@/components/bottom-navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { StaticSparkleBackground } from '@/components/static-sparkle-background';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};


const AboutSection = ({ title, children, icon, isMobile }: { title: string, children: React.ReactNode, icon?: React.ReactNode, isMobile: boolean }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-black/20 p-6 md:p-8 rounded-2xl h-full flex flex-col"
    >
        <div className="flex items-center gap-4 mb-4">
            {icon && <div className="text-custom-gold bg-black/30 p-3 rounded-full">{React.cloneElement(icon as React.ReactElement, { size: isMobile ? 24 : 28 })}</div>}
            <h3 className="text-xl md:text-2xl font-bold font-plex-sans-condensed text-custom-gold">
                {title}
            </h3>
        </div>
        <p className="text-base md:text-lg text-white/90 font-plex-sans leading-relaxed">
            {children}
        </p>
    </motion.div>
);


export default function AboutPage() {
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
    const isMobile = useIsMobile();

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
      const { scrollTop } = event.currentTarget;
      setIsContentScrolled(scrollTop > 0);
    };

    const handleNavigation = (view: ActiveView) => {
        if (view === 'home') router.push('/');
        else if (view === 'cart') router.push('/cart');
        else if (view === 'profile') router.push('/profile');
        else if (view === 'faq') router.push('/faq');
    };

    const handleHeaderNavigate = (view: 'about' | 'faq') => {
        router.push(`/${view}`);
    }

    const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

    return (
        <>
            {isMobile ? <StaticSparkleBackground /> : <SparkleBackground />}
            <div className="flex flex-col h-screen">
                <Header
                  onProfileOpenChange={setIsProfileOpen}
                  isContentScrolled={isContentScrolled}
                  onReset={() => router.push('/')}
                  onNavigate={handleHeaderNavigate}
                  activeView={'about'}
                  onSearchSubmit={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
                  searchInput={searchInput}
                  onSearchInputChange={setSearchInput}
                  isSearchingOnAbout={true}
                />
                <main onScroll={handleScroll} className={cn("flex-grow pt-36 flex flex-col overflow-y-auto no-scrollbar", isMobile && "pb-16")}>
                    <div className="bg-[#5D2B79] rounded-[20px] md:rounded-[40px] mb-8 mx-4 md:mx-32 animate-fade-in flex flex-col" style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}>
                        <div className="bg-white/10 rounded-[20px] md:rounded-[40px] py-8 px-6 md:py-10 md:px-24 flex-grow">
                            <SectionTitle className="text-3xl md:text-4xl text-center mb-8 md:mb-12 font-poppins">
                                Our Philosophy
                            </SectionTitle>
                            
                            <motion.div
                              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                            >
                                <AboutSection title="Handcrafted with Passion" icon={<Heart />} isMobile={isMobile}>
                                    Every single chocolate is a labor of love. We meticulously craft each piece by hand, ensuring that every detail is perfect, from the rich flavors to the elegant presentation.
                                </AboutSection>
                                
                                <AboutSection title="Pure & Wholesome" icon={<Leaf />} isMobile={isMobile}>
                                    Your trust is our top priority. That’s why all ChocoSmiley products are 100% vegetarian and eggless. We use only the finest ingredients for a delightful and guilt-free indulgence.
                                </AboutSection>
                                
                                <AboutSection title="The Art of Gifting" icon={<Gift />} isMobile={isMobile}>
                                    We believe the perfect gift is personal. Our customizable boxes allow you to hand-pick every flavor, ensuring your gift is as unique as the person receiving it.
                                </AboutSection>
                                
                                <AboutSection title="Join Our Story" icon={<Sparkles />} isMobile={isMobile}>
                                    Thank you for being a part of our journey. We are excited to help you craft your perfect gift and spread a little more happiness in the world, one chocolate at a time.
                                </AboutSection>
                            </motion.div>
                        </div>
                    </div>
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
            <BottomNavbar activeView={'about'} onNavigate={handleNavigation} cartItemCount={cartItemCount} />
        </>
    );
}
