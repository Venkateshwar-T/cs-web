// @/components/footer.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { AiOutlineInstagram, AiOutlineWhatsApp } from 'react-icons/ai';
import { IoLogoFacebook } from 'react-icons/io5';
import { Separator } from './ui/separator';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="text-sm text-gray-300 hover:text-white transition-colors">
        {children}
    </Link>
);

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-3">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        {children}
    </div>
);

export function Footer() {
    return (
        <footer className="bg-footer-gray text-white font-poppins rounded-t-3xl mt-8 mr-10 ml-10 py-10 px-4 md:px-16">
            <div className="container mx-20 grid grid-cols-1 md:grid-cols-5 gap-18">
                {/* Logo */}
                <div className="md:col-span-1 flex items-start">
                    <Image
                        src="/Choco Smiley Footer Logo.png"
                        alt="Choco Smiley Logo"
                        width={200}
                        height={80}
                        className="w-48"
                    />
                </div>

                {/* Contact */}
                <FooterSection title="Contact">
                    <a href="mailto:chocosmiley79@gmail.com" className="flex items-center gap-2 text-sm text-gray-300 hover:text-custom-gold transition-colors">
                        <Mail size={16} />
                        <span>chocosmiley79@gmail.com</span>
                    </a>
                    <a href="https://wa.me/917411414007" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-custom-gold transition-colors">
                        <AiOutlineWhatsApp size={18} />
                        <span>+91 74114 14007</span>
                    </a>
                </FooterSection>

                {/* Company */}
                <FooterSection title="Company">
                    <div className="flex flex-col gap-2">
                        <a href="/about" className="flex items-center gap-2 text-sm text-gray-300 hover:text-custom-gold transition-colors">About Us</a>
                        <a href="/faq" className="flex items-center gap-2 text-sm text-gray-300 hover:text-custom-gold transition-colors">FAQs</a>
                        <a href="/" className="flex items-center gap-2 text-sm text-gray-300 hover:text-custom-gold transition-colors">Explore</a>
                    </div>
                </FooterSection>

                {/* Policies */}
                <FooterSection title="Policies">
                    <div className="flex flex-col gap-2">
                        <a href="/privacy" className="flex items-center gap-2 text-sm text-gray-300 hover:text-custom-gold transition-colors">Privacy Policy</a>
                        <a href="/terms" className="flex items-center gap-2 text-sm text-gray-300 hover:text-custom-gold transition-colors">Terms & Conditions</a>
                        <a href="/shipping" className="flex items-center gap-2 text-sm text-gray-300 hover:text-custom-gold transition-colors">Shipping & Delivery</a>
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

            <Separator className="my-8 bg-white" />

            <div className="text-center text-white text-sm">
                <p>© 2025 Choco Smiley. All rights reserved.</p>
            </div>
        </footer>
    );
}
