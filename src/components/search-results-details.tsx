import { ProductCard } from "./product-card";

interface SearchResultsDetailsProps {
  query: string;
  onAddToCart: (productName: string, quantity: number) => void;
}

export function SearchResultsDetails({ query, onAddToCart }: SearchResultsDetailsProps) {
  return (
    <div className="bg-white/50 h-full flex-grow rounded-t-3xl p-8 ml-8 mr-8 overflow-y-auto no-scrollbar">
      <h2 className="text-xl text-white mb-6">
        Showing results for <span className="italic text-custom-gold">{query}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCard key={i} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}
