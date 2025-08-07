import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
                    <path d="M15.402 24v-9.255h3.102l.464-3.6h-3.566V8.82c0-1.042.29-1.752 1.783-1.752h1.905V3.725a26.115 26.115 0 0 0-2.775-.145c-2.747 0-4.627 1.676-4.627 4.757v2.618H8.583v3.6h3.102V24h3.717z" />
                </clipPath>
            </defs>
            <rect 
                width="24" 
                height="24" 
                fill="white" 
                clipPath="url(#f-clip)" 
                style={{ clipRule: 'evenodd' }} 
            />
        </svg>
    )
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
          <div className="ml-3 w-6 h-6 bg-white rounded-full"></div>
          <div className="flex items-center gap-4">
            <FacebookIcon className="h-6 w-6 cursor-pointer" />
            <InstagramIcon className="h-6 w-6 text-white cursor-pointer" />
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
