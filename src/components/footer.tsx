// @/components/footer.tsx
'use client';

import Image from 'next/image';
import { Mail } from 'lucide-react';
import { AiOutlineInstagram } from 'react-icons/ai';
import { IoLogoFacebook, IoLogoWhatsapp } from 'react-icons/io5';
import { Separator } from './ui/separator';

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-3">
        <h3 className="font-bold text-white text-base md:text-lg">{title}</h3>
        {children}
    </div>
);

export function Footer() {
    return (
        <footer className="bg-footer-gray text-white font-poppins py-10 px-8 md:px-16 md:rounded-t-[40px] mx-0 md:mx-24 mb-16 md:mb-0">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8">
                {/* Logo */}
                <div className="flex items-start">
                    <Image
                        src="/Choco Smiley Footer Logo.png"
                        alt="Choco Smiley Logo"
                        width={200}
                        height={80}
                        className="w-36 md:w-48"
                        onDragStart={(e) => e.preventDefault()}
                    />
                </div>

                {/* Contact */}
                <FooterSection title="Contact">
                    <a href="mailto:chocosmiley79@gmail.com" className="flex items-center gap-2 text-xs md:text-sm text-gray-300 hover:text-custom-gold transition-colors">
                        <Mail size={16} />
                        <span>chocosmiley79@gmail.com</span>
                    </a>
                    <a href="https://wa.me/917411414007" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs md:text-sm text-gray-300 hover:text-custom-gold transition-colors">
                        <IoLogoWhatsapp size={18} />
                        <span>+91 74114 14007</span>
                    </a>
                </FooterSection>

                {/* Company */}
                <FooterSection title="Company">
                    <div className="flex flex-col gap-2">
                        <a href="/about" className="flex items-center gap-2 text-xs md:text-sm text-gray-300 hover:text-custom-gold transition-colors">About Us</a>
                        <a href="/faq" className="flex items-center gap-2 text-xs md:text-sm text-gray-300 hover:text-custom-gold transition-colors">FAQs</a>
                        <a href="/" className="flex items-center gap-2 text-xs md:text-sm text-gray-300 hover:text-custom-gold transition-colors">Explore</a>
                    </div>
                </FooterSection>

                {/* Policies */}
                <FooterSection title="Policies">
                    <div className="flex flex-col gap-2">
                        <a href="/privacy" className="flex items-center gap-2 text-xs md:text-sm text-gray-300 hover:text-custom-gold transition-colors">Privacy Policy</a>
                        <a href="/terms" className="flex items-center gap-2 text-xs md:text-sm text-gray-300 hover:text-custom-gold transition-colors">Terms & Conditions</a>
                        <a href="/shipping" className="flex items-center gap-2 text-xs md:text-sm text-gray-300 hover:text-custom-gold transition-colors">Shipping & Delivery</a>
                    </div>
                </FooterSection>

                {/* Follow Us */}
                <FooterSection title="Follow Us">
                    <div className="flex items-center gap-2">
                        <a href="#" aria-label="Instagram">
                            <AiOutlineInstagram className="h-7 w-7 transition-colors hover:text-custom-gold" />
                        </a>
                        <a href="#" aria-label="Facebook">
                            <IoLogoFacebook className="h-7 w-7 transition-colors hover:text-custom-gold" />
                        </a>
                    </div>
                </FooterSection>
            </div>

            <Separator className="my-4 md:my-8 bg-white/50" />

            <div className="text-center text-white/80 text-xs md:text-sm">
                <p>© 2025 Choco Smiley. All rights reserved.</p>
            </div>
        </footer>
    );
}
