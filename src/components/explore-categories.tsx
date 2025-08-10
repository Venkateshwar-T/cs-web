import { CategoryCard } from "@/components/category-card";

export function ExploreCategories() {
  const categories = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ];

  return (
    <div className="flex flex-wrap justify-around gap-8">
      {categories.map((category) => (
        <CategoryCard key={category.id} />
      ))}
    </div>
  );
}
