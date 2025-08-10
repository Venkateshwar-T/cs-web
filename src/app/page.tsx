import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow pt-72">
        <div className="bg-white/50 backdrop-blur-lg h-full rounded-t-2xl mx-8 md:mx-32">
          {/* Content for the white box can go here */}
        </div>
      </main>
    </div>
  );
}
