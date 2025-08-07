export default function Home() {
  return (
    <main>
      <div className="flex items-center">
        <div className="w-[45%] h-20 bg-[#5d2b79] rounded-r-full shadow-md mt-4"></div>
        <div className="relative h-8 bg-yellow-400 w-[60%] rounded-l-full mt-4 shadow-md -ml-20">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
        </div>
      </div>
    </main>
  );
}
