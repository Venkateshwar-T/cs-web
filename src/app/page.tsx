import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <main>
      <div className="flex items-center">
        <div className="w-1/3 h-20 bg-[#5d2b79] rounded-r-full shadow-md mt-4"></div>
        <div className="relative h-10 bg-yellow-400 flex-grow rounded-l-full mt-4 shadow-md -ml-12 flex items-center justify-between pr-8">
          <div className="ml-3 w-6 h-6 bg-white rounded-full"></div>
          <Avatar className="h-12 w-12 border-2 border-black">
            <AvatarImage src="https://placehold.co/64x64.png" alt="User" data-ai-hint="person portrait" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </main>
  );
}
