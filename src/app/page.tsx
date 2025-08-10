
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow pt-72">
        <div className="bg-white/50 h-full rounded-t-2xl mx-8 md:mx-32 p-8">
          <h2 className="text-2xl font-bold text-gray-800">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            <div className="w-full h-40 md:h-48 bg-[#D9D9D9] rounded-lg"></div>
            <div className="w-full h-40 md:h-48 bg-[#D9D9D9] rounded-lg"></div>
            <div className="w-full h-40 md:h-48 bg-[#D9D9D9] rounded-lg"></div>
            <div className="w-full h-40 md:h-48 bg-[#D9D9D9] rounded-lg"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
