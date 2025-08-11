import Image from "next/image";
import { SectionTitle } from "./section-title";

export function ExploreCategories() {
  const images = [
    { id: 1, src: "https://placehold.co/600x400.png", alt: "Category 1", hint: "chocolate gift" },
    { id: 2, src: "https://placehold.co/600x400.png", alt: "Category 2", hint: "gift basket" },
    { id: 3, src: "https://placehold.co/600x400.png", alt: "Category 3", hint: "artisan chocolate" },
    { id: 4, src: "https://placehold.co/600x400.png", alt: "Category 4", hint: "luxury gifts" },
  ];

  return (
    <div className="bg-white/50 h-full rounded-t-3xl p-8 overflow-y-auto no-scrollbar mx-8 md:mx-32 flex flex-col">
      <SectionTitle>
        Explore Categories
      </SectionTitle>
      <div className="flex flex-1 justify-around items-center gap-8 pb-8">
        {images.map((image) => (
          <div key={image.id} className="flex-1 max-w-64 aspect-[1/1]">
            <Image
              src={image.src}
              alt={image.alt}
              width={600}
              height={400}
              data-ai-hint={image.hint}
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
