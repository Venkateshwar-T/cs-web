
interface SearchResultsDetailsProps {
  query: string;
}

export function SearchResultsDetails({ query }: SearchResultsDetailsProps) {
  return (
    <div className="bg-white/50 h-full flex-grow rounded-tl-2xl rounded-tr-2xl p-8 ml-8 mr-8">
      <h2 className="text-xl text-white">
        Showing results for <span className="italic font-bold text-custom-gold">{query}</span>
      </h2>
    </div>
  );
}
