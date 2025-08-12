import Image from "next/image";
import { SectionTitle } from "./section-title";

export function ExploreCategories() {
  const categoryImages = [
    { id: 1, src: "https://placehold.co/600x400.png", alt: "Category 1", hint: "chocolate gift" },
    { id: 2, src: "https://placehold.co/600x400.png", alt: "Category 2", hint: "gift basket" },
    { id: 3, src: "https://placehold.co/600x400.png", alt: "Category 3", hint: "artisan chocolate" },
    { id: 4, src: "https://placehold.co/600x400.png", alt: "Category 4", hint: "luxury gifts" },
  ];

  const flavourImages = [
    { id: 1, src: "https://placehold.co/600x400.png", alt: "Flavour 1", hint: "dark chocolate" },
    { id: 2, src: "https://placehold.co/600x400.png", alt: "Flavour 2", hint: "milk chocolate" },
    { id: 3, src: "https://placehold.co/600x400.png", alt: "Flavour 3", hint: "white chocolate" },
    { id: 4, src: "https://placehold.co/600x400.png", alt: "Flavour 4", hint: "caramel" },
    { id: 5, src: "https://placehold.co/600x400.png", alt: "Flavour 5", hint: "hazelnut" },
  ];

  return (
    <div className="bg-[#5D2B79] h-full rounded-t-[40px] mx-8 md:mx-32">
        <div className="bg-white/20 h-full rounded-t-[40px] p-8 overflow-y-auto no-scrollbar">
            <SectionTitle>
                Explore Categories
            </SectionTitle>
            <div className="flex flex-1 justify-around items-center gap-8 pb-8">
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

            <SectionTitle>
                Explore Flavours
            </SectionTitle>
            <div className="flex flex-1 justify-around items-center gap-8 pb-8">
                {flavourImages.map((image) => (
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
        </div>
    </div>
  );
}
