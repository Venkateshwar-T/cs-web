import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow pt-72">
        <div className="bg-white h-full rounded-t-2xl mx-16">
          {/* Content for the white box can go here */}
        </div>
      </main>
    </div>
  );
}
