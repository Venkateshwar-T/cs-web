
// @/components/about-view.tsx
'use client';

import { motion } from 'framer-motion';
import { SectionTitle } from "./section-title";
import { Heart, Leaf, Gift, Sparkles } from "lucide-react";

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


const AboutSection = ({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-black/20 p-8 rounded-2xl h-full flex flex-col"
    >
        <div className="flex items-center gap-4 mb-4">
            {icon && <div className="text-custom-gold bg-black/30 p-3 rounded-full">{icon}</div>}
            <h3 className="text-2xl font-bold font-plex-sans-condensed text-custom-gold">
                {title}
            </h3>
        </div>
        <p className="text-lg text-white/90 font-plex-sans leading-relaxed">
            {children}
        </p>
    </motion.div>
);


export function AboutView() {
  return (
    <div className="bg-[#5D2B79] rounded-[40px] mx-8 md:mx-32 animate-fade-in h-[85vh] flex flex-col" style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="bg-white/10 rounded-[40px] py-10 px-12 md:px-24 flex-grow overflow-y-auto no-scrollbar">
            <SectionTitle className="text-4xl text-center mb-12 font-poppins">
                Our Philosophy
            </SectionTitle>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
                <AboutSection title="Handcrafted with Passion" icon={<Heart size={28} />}>
                    Every single chocolate is a labor of love. We meticulously craft each piece by hand, ensuring that every detail is perfect, from the rich flavors to the elegant presentation.
                </AboutSection>
                
                <AboutSection title="Pure & Wholesome" icon={<Leaf size={28} />}>
                    Your trust is our top priority. That’s why all ChocoSmiley products are 100% vegetarian and eggless. We use only the finest ingredients for a delightful and guilt-free indulgence.
                </AboutSection>
                
                <AboutSection title="The Art of Gifting" icon={<Gift size={28} />}>
                    We believe the perfect gift is personal. Our customizable boxes allow you to hand-pick every flavor, ensuring your gift is as unique as the person receiving it.
                </AboutSection>
                
                <AboutSection title="Join Our Story" icon={<Sparkles size={28} />}>
                    Thank you for being a part of our journey. We are excited to help you craft your perfect gift and spread a little more happiness in the world, one chocolate at a time.
                </AboutSection>
            </motion.div>
        </div>
    </div>
  );
}
