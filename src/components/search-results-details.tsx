import { ProductCard } from "./product-card";

interface SearchResultsDetailsProps {
  query: string;
  onAddToCart: (productName: string, quantity: number) => void;
  cart: Record<string, number>;
}

export function SearchResultsDetails({ query, onAddToCart, cart }: SearchResultsDetailsProps) {
  const products = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    name: `Diwali Collection Box ${i + 1}`,
  }));

  return (
    <div className="bg-white/20 h-full flex-grow rounded-t-[40px] p-8 ml-12 mr-8 overflow-y-auto custom-scrollbar">
      <h2 className="text-xl text-white mb-6">
        Showing results for <span className="italic text-custom-gold">{query}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            productName={product.name}
            onAddToCart={onAddToCart}
            quantity={cart[product.name] || 0}
          />
        ))}
      </div>
    </div>
  );
}
