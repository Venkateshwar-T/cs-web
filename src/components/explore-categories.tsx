import { CategoryCard } from "@/components/category-card";
import { SectionTitle } from "./section-title";

export function ExploreCategories() {
  const categories = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ];

  return (
    <div className="bg-white/50 h-full rounded-t-3xl p-8 overflow-y-auto no-scrollbar mx-8 md:mx-32 flex-grow">
      <SectionTitle>
        Explore Categories
      </SectionTitle>
      <div className="flex flex-wrap justify-around gap-8">
        {categories.map((category) => (
          <CategoryCard key={category.id} />
        ))}
      </div>
    </div>
  );
}
