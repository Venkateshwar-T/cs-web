
import Image from "next/image";
import { SectionTitle } from "./section-title";

export function ExploreCategories() {
  const categoryImages = [
    { id: 1, src: "/categories/choco1.png", alt: "Category 1", hint: "chocolate gift" },
    { id: 2, src: "/categories/choco2.png", alt: "Category 2", hint: "gift basket" },
    { id: 3, src: "/categories/choco3.png", alt: "Category 3", hint: "artisan chocolate" },
    { id: 4, src: "/categories/choco4.png", alt: "Category 4", hint: "luxury gifts" },
  ];

  const flavourImages = [
    { id: 1, src: "https://placehold.co/600x400.png", alt: "Flavour 1", hint: "dark chocolate" },
    { id: 2, src: "https://placehold.co/600x400.png", alt: "Flavour 2", hint: "milk chocolate" },
    { id: 3, src: "https://placehold.co/600x400.png", alt: "Flavour 3", hint: "white chocolate" },
    { id: 4, src: "https://placehold.co/600x400.png", alt: "Flavour 4", hint: "caramel" },
    { id: 5, src: "https://placehold.co/600x400.png", alt: "Flavour 5", hint: "hazelnut" },
  ];

  return (
    <div className="bg-[#5D2B79] h-full rounded-t-[40px] mx-8 md:mx-32 animate-fade-in" style={{ animationDuration: '0.5s', animationDelay: '0.6s', animationFillMode: 'both' }}>
        <div className="bg-white/20 h-full rounded-t-[40px] py-6 px-12 overflow-y-auto no-scrollbar">
            <SectionTitle className="pl-8">
                Explore Categories
            </SectionTitle>
            <div className="flex flex-1 justify-around items-center gap-8 pt-2 pb-8">
                {categoryImages.map((image) => (
                <div key={image.id} className="flex-1 max-w-64 aspect-[5/6]">
                    <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    data-ai-hint={image.hint}
                    className="w-full h-full object-cover rounded-[40px]"
                    />
                </div>
                ))}
            </div>

            <SectionTitle className="pl-8">
                Explore Flavours
            </SectionTitle>
            <div className="flex flex-1 justify-around items-center gap-8 pt-2 pb-8">
                {flavourImages.map((image) => (
                <div key={image.id} className="flex-1 max-w-44 aspect-[5/6]">
                    <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    data-ai-hint={image.hint}
                    className="w-full h-full object-cover rounded-[40px]"
                    />
                </div>
                ))}
            </div>
        </div>
    </div>
  );
}
