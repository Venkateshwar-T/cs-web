import { CategoryCard } from "@/components/category-card";

export function ExploreCategories() {
  const categories = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
  ];

  return (
    <main className="flex-grow pt-72 overflow-hidden transition-opacity duration-500 opacity-100 flex">
      <div className="bg-white/50 h-full rounded-t-2xl p-8 overflow-y-auto no-scrollbar mx-8 md:mx-32 flex-grow">
        <h2 className="text-2xl font-bold text-white mb-8 pl-4">
          Explore Categories
        </h2>
        <div className="flex flex-wrap justify-around gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} />
          ))}
        </div>
      </div>
    </main>
  );
}
