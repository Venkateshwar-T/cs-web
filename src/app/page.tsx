import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="pt-56">
        <div className="bg-white h-96 rounded-t-2xl mx-4">
          {/* Content for the white box can go here */}
        </div>
      </main>
    </div>
  );
}
