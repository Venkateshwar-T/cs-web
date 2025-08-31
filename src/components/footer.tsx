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
        <footer className="bg-custom-gray-dark text-white rounded-t-3xl mt-8 py-10 px-4 md:px-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-6 gap-8">
                {/* Logo */}
                <div className="md:col-span-2 flex items-start">
                    <Image
                        src="/Choco Smiley Logo.png"
                        alt="Choco Smiley Logo"
                        width={200}
                        height={80}
                        className="w-48"
                    />
                </div>

                {/* Contact */}
                <FooterSection title="Contact">
                    <a href="mailto:chocosmiley79@gmail.com" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                        <Mail size={16} />
                        <span>chocosmiley79@gmail.com</span>
                    </a>
                    <a href="https://wa.me/917411414007" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                        <AiOutlineWhatsApp size={18} />
                        <span>+91 74114 14007</span>
                    </a>
                </FooterSection>

                {/* Company */}
                <FooterSection title="Company">
                    <div className="flex flex-col gap-2">
                        <FooterLink href="/about">About Us</FooterLink>
                        <FooterLink href="/faq">FAQs</FooterLink>
                        <FooterLink href="/">Explore</FooterLink>
                    </div>
                </FooterSection>

                {/* Policies */}
                <FooterSection title="Policies">
                    <div className="flex flex-col gap-2">
                        <FooterLink href="/privacy">Privacy Policy</FooterLink>
                        <FooterLink href="/terms">Terms & Conditions</FooterLink>
                        <FooterLink href="/shipping">Shipping & Delivery</FooterLink>
                    </div>
                </FooterSection>

                {/* Follow Us */}
                <FooterSection title="Follow Us">
                    <div className="flex items-center gap-4">
                        <a href="#" aria-label="Instagram">
                            <AiOutlineInstagram className="h-7 w-7 transition-colors hover:text-custom-gold" />
                        </a>
                        <a href="#" aria-label="Facebook">
                            <IoLogoFacebook className="h-7 w-7 transition-colors hover:text-custom-gold" />
                        </a>
                    </div>
                </FooterSection>
            </div>

            <Separator className="my-8 bg-gray-600" />

            <div className="text-center text-gray-400 text-sm">
                <p>© 2025 Choco Smiley. All rights reserved.</p>
            </div>
        </footer>
    );
}
