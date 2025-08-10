
'use client';

interface SearchResultsProps {
  searchQuery: string;
}

export function SearchResults({ searchQuery }: SearchResultsProps) {
  return (
    <main className="flex-grow pt-72 overflow-hidden transition-opacity duration-500 opacity-100 flex">
      <div className="w-64 bg-white/30 backdrop-blur-sm rounded-tr-2xl flex-shrink-0">
        {/* Sidebar content can go here */}
      </div>
      <div className="bg-white/50 h-full rounded-t-2xl p-8 overflow-y-auto no-scrollbar mx-8 flex-grow">
        <h2 className="text-2xl font-bold text-white mb-8 pl-4">
          {`Showing results for "${searchQuery}"`}
        </h2>
        <div className="flex flex-wrap justify-around gap-8">
          <div className="bg-card rounded-lg w-64 h-72 flex-shrink-0"></div>
          <div className="bg-card rounded-lg w-64 h-72 flex-shrink-0"></div>
          <div className="bg-card rounded-lg w-64 h-72 flex-shrink-0"></div>
          <div className="bg-card rounded-lg w-64 h-72 flex-shrink-0"></div>
        </div>
      </div>
    </main>
  );
}
