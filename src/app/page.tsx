
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow pt-72 overflow-hidden">
        <div className="bg-white/50 h-full rounded-t-2xl mx-8 md:mx-32 p-8 overflow-y-auto no-scrollbar">
          <h2 className="text-2xl font-bold text-white mb-8">Explore Categories</h2>
          <div className="flex flex-wrap justify-start gap-8">
            <div className="bg-card rounded-lg w-48 h-64 flex-shrink-0"></div>
            <div className="bg-card rounded-lg w-48 h-64 flex-shrink-0"></div>
            <div className="bg-card rounded-lg w-48 h-64 flex-shrink-0"></div>
            <div className="bg-card rounded-lg w-48 h-64 flex-shrink-0"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
