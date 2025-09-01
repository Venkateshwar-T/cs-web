// @/components/about-view.tsx

import { SectionTitle } from "./section-title";

const AboutSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8 last:mb-0">
        <h3 className="text-2xl font-bold font-plex-sans-condensed text-custom-gold mb-3">{title}</h3>
        <p className="text-lg text-white/90 font-plex-sans leading-relaxed">
            {children}
        </p>
    </div>
);


export function AboutView() {
  return (
    <div className="bg-[#5D2B79] h-full rounded-t-[40px] mx-8 md:mx-32 animate-fade-in" style={{ animationDuration: '0.5s', animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="bg-white/20 h-full rounded-t-[40px] py-10 px-12 md:px-24 overflow-y-auto no-scrollbar">
            <SectionTitle className="text-4xl text-center mb-12 font-poppins">
                Our Philosophy
            </SectionTitle>
            
            <div className="max-w-4xl mx-auto">
                <AboutSection title="Handcrafted with Passion">
                    Every single chocolate is a labor of love. We meticulously craft each piece by hand, ensuring that every detail is perfect, from the rich flavors to the elegant presentation. Our chocolates are made with a hands-on approach and a deep commitment to quality that you can taste in every bite.
                </AboutSection>
                
                <AboutSection title="Pure & Wholesome Ingredients">
                    Your trust is our top priority. That’s why we are proud to say that all ChocoSmiley products are 100% vegetarian and eggless. We use only the finest ingredients to create our decadent treats, ensuring a delightful and guilt-free indulgence for everyone.
                </AboutSection>
                
                <AboutSection title="The Art of Gifting">
                    We understand that the perfect gift is personal. That's why we put you in control of the creation process. Our customizable boxes allow you to hand-pick every flavor, ensuring your gift is as unique as the person receiving it.
                </AboutSection>
                
                <AboutSection title="Join Our Story">
                    Thank you for being a part of our journey. We are excited to help you craft your perfect gift and spread a little more happiness in the world.
                </AboutSection>
            </div>
        </div>
    </div>
  );
}
