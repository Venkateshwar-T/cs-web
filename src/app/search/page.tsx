
import { Header } from "@/components/header";
import { SearchResults } from "@/components/search-results";

export default function SearchPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <SearchResults />
    </div>
  )
}
