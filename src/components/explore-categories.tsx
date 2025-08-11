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
    <div className="bg-white/50 h-full rounded-t-3xl p-8 overflow-y-auto overflow-x-auto no-scrollbar mx-8 md:mx-32 flex-grow">
      <SectionTitle>
        Explore Categories
      </SectionTitle>
      <div className="flex flex-nowrap justify-start gap-8 py-4">
        {images.map((image) => (
          <div key={image.id} className="flex-shrink-0 w-48 h-56 sm:w-56 sm:h-64 md:w-64 md:h-72">
            <Image
              src={image.src}
              alt={image.alt}
              width={600}
              height={400}
              data-ai-hint={image.hint}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
