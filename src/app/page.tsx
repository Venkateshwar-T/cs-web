import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <defs>
        <clipPath id="f-clip">
          <path d="M15 8h2V5h-2.5a2.5 2.5 0 0 0-2.5 2.5V10h-2v3h2v9h3v-9h2l.5-3h-2.5V8z" />
        </clipPath>
      </defs>
      <rect width="24" height="24" rx="3" fill="white" />
      <path
        d="M15 8h2V5h-2.5a2.5 2.5 0 0 0-2.5 2.5V10h-2v3h2v9h3v-9h2l.5-3h-2.5V8z"
        fill="currentColor"
        clipPath="url(#f-clip)"
        fillRule="evenodd"
      />
    </svg>
  );
}


function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    )
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}


export default function Home() {
  return (
    <main>
      <div className="flex items-center">
        <div className="w-1/3 h-20 bg-[#5d2b79] rounded-r-full shadow-md mt-4"></div>
        <div className="relative h-10 bg-yellow-400 flex-grow rounded-l-full mt-4 shadow-md -ml-12 flex items-center justify-between pr-12">
          <div className="flex items-center gap-6">
            <div className="ml-3 w-6 h-6 bg-white rounded-full"></div>
            <nav className="flex items-center gap-6 text-sm">
                <Link href="/" className="text-white font-bold hover:text-gray-200 transition-colors">Home</Link>
                <Link href="/about" className="text-white font-bold hover:text-gray-200 transition-colors">About</Link>
                <Link href="/faq" className="text-white font-bold hover:text-gray-200 transition-colors">FAQ</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white text-yellow-400 px-4 py-1 rounded-full text-sm font-bold hover:bg-yellow-400 hover:text-white transition-colors">Enquire Now</button>
            <div className="w-px h-6 bg-white" />
            <InstagramIcon className="h-6 w-6 text-white cursor-pointer" />
            <FacebookIcon className="h-6 w-6 text-yellow-400 cursor-pointer" />
            <Avatar className="h-12 w-12 border-2 border-black">
                <AvatarImage src="https://placehold.co/64x64.png" alt="User" data-ai-hint="person portrait" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </main>
  );
}