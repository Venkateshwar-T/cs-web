
'use client';

import Image from "next/image";
import { SectionTitle } from "./section-title";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};


export function ExploreCategories() {
  const categoryImages = [
    { id: 1, src: "/categories/choco1.png", alt: "Category 1", hint: "chocolate gift", title: "Gift Boxes" },
    { id: 2, src: "/categories/choco2.png", alt: "Category 2", hint: "gift basket", title: "Hampers" },
    { id: 3, src: "/categories/choco3.png", alt: "Category 3", hint: "artisan chocolate", title: "Artisanal Bars" },
    { id: 4, src: "/categories/choco4.png", alt: "Category 4", hint: "luxury gifts", title: "Luxury Collection" },
  ];

  const flavourImages = [
    { id: 1, src: "https://picsum.photos/seed/flavour1/600/400", alt: "Flavour 1", hint: "dark chocolate", title: "Dark Chocolate" },
    { id: 2, src: "https://picsum.photos/seed/flavour2/600/400", alt: "Flavour 2", hint: "milk chocolate", title: "Milk Chocolate" },
    { id: 3, src: "https://picsum.photos/seed/flavour3/600/400", alt: "Flavour 3", hint: "white chocolate", title: "White Chocolate" },
    { id: 4, src: "https://picsum.photos/seed/flavour4/600/400", alt: "Flavour 4", hint: "caramel", title: "Caramel" },
    { id: 5, src: "https://picsum.photos/seed/flavour5/600/400", alt: "Flavour 5", hint: "hazelnut", title: "Hazelnut" },
  ];

  return (
    <motion.div 
      className="bg-[#5D2B79] h-full rounded-t-[25px] md:rounded-t-[40px] mx-4 md:mx-32"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
    >
        <div className="bg-white/20 h-full rounded-t-[25px] md:rounded-t-[40px] py-4 md:py-6 px-4 md:px-12 flex flex-col">
            <div className="flex-grow overflow-y-auto no-scrollbar min-h-0">
                <SectionTitle className="flex justify-center md:justify-start text-lg md:text-2xl md:pl-8 mb-2 md:mb-4">
                    Explore Categories
                </SectionTitle>
                <motion.div 
                    className="grid grid-cols-2 md:flex md:flex-row flex-1 justify-around items-center gap-4 md:gap-8 pb-6 px-2 md:px-0"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {categoryImages.map((image) => (
                    <motion.div key={image.id} className="w-full aspect-[5/6] relative group" variants={itemVariants}>
                        <Image
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={400}
                        data-ai-hint={image.hint}
                        className="w-full h-full object-cover rounded-[20px] ring-1 ring-inset ring-custom-purple-dark"
                        onDragStart={(e) => e.preventDefault()}
                        />
                        <div className="absolute inset-x-0 bottom-2 md:bottom-3 flex items-end justify-center">
                          <h3 className="text-white text-xs md:text-lg text-center font-plex-sans font-semibold [text-shadow:0_4px_8px_rgb(0_0_0_/_0.9)]">{image.title}</h3>
                        </div>
                    </motion.div>
                    ))}
                </motion.div>

                <SectionTitle className="flex justify-center md:justify-start text-lg md:text-2xl md:pl-8 mb-2 md:mb-4 lg:mb-6">
                    Explore Flavours
                </SectionTitle>
                <motion.div 
                    className="flex flex-row md:flex-wrap overflow-x-auto no-scrollbar md:overflow-visible flex-1 md:justify-around items-center gap-4 md:gap-8 px-2 md:px-0"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {flavourImages.map((image) => (
                    <motion.div key={image.id} className="w-24 md:flex-1 md:w-full max-w-xs md:max-w-44 flex-shrink-0 md:flex-shrink aspect-square md:aspect-[5/6] relative group" variants={itemVariants}>
                        <Image
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={400}
                        data-ai-hint={image.hint}
                        className="w-full h-full object-cover rounded-[20px] ring-1 ring-inset ring-custom-purple-dark"
                        onDragStart={(e) => e.preventDefault()}
                        />
                        <div className="absolute inset-x-0 bottom-2 md:bottom-3 flex items-end justify-center">
                            <h3 className="text-white text-xs md:text-lg text-center font-plex-sans font-semibold [text-shadow:0_4px_8px_rgb(0_0_0_/_0.9)]">{image.title}</h3>
                        </div>
                    </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    </motion.div>
  );
}
