export function ProductCardSkeleton() {
  return (
    <div className="bg-white/80 text-black rounded-3xl overflow-hidden flex flex-col h-full shadow-custom-dark animate-pulse">
      <div className="relative w-full pt-[80%] bg-gray-300/50 rounded-t-3xl"></div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="h-5 w-3/4 bg-gray-300/50 rounded"></div>
          <div className="h-3 w-1/2 bg-gray-300/50 rounded mt-2"></div>
        </div>
        <div className="mt-4">
          <div className="h-4 w-1/4 bg-gray-300/50 rounded"></div>
          <div className="flex items-center mt-1">
            <div className="h-5 w-1/3 bg-gray-300/50 rounded"></div>
            <div className="flex-grow ml-2">
              <div className="h-9 w-full bg-gray-300/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
