
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
    { id: 1, src: "/categories/choco1.png", alt: "Category 1", hint: "chocolate gift" },
    { id: 2, src: "/categories/choco2.png", alt: "Category 2", hint: "gift basket" },
    { id: 3, src: "/categories/choco3.png", alt: "Category 3", hint: "artisan chocolate" },
    { id: 4, src: "/categories/choco4.png", alt: "Category 4", hint: "luxury gifts" },
  ];

  const flavourImages = [
    { id: 1, src: "https://placehold.co/600x400.png", alt: "Flavour 1", hint: "dark chocolate" },
    { id: 2, src: "https://placehold.co/600x400.png", alt: "Flavour 2", hint: "milk chocolate" },
    { id: 3, src: "https://placehold.co/600x400.png", alt: "Flavour 3", hint: "white chocolate" },
    { id: 4, src: "https://placehold.co/600x400.png", alt: "Flavour 4", hint: "caramel" },
    { id: 5, src: "https://placehold.co/600x400.png", alt: "Flavour 5", hint: "hazelnut" },
  ];

  return (
    <motion.div 
      className="bg-[#5D2B79] h-full rounded-t-[20px] md:rounded-t-[40px] px-4 md:px-0 md:mx-32"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
    >
        <div className="bg-white/20 h-full rounded-t-[25px] md:rounded-t-[40px] py-4 md:py-6 px-4 md:px-12 flex flex-col">
            <div className="flex-grow overflow-y-auto no-scrollbar min-h-0">
                <SectionTitle className="flex justify-center md:justify-start pl-2 text-lg md:text-2xl md:pl-8 mb-2 md:mb-4">
                    Explore Categories
                </SectionTitle>
                <motion.div 
                    className="grid grid-cols-2 md:flex md:flex-row flex-1 justify-around items-center gap-4 md:gap-8 pb-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {categoryImages.map((image) => (
                    <motion.div key={image.id} className="w-full aspect-[5/6]" variants={itemVariants}>
                        <Image
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={400}
                        data-ai-hint={image.hint}
                        className="w-full h-full object-cover rounded-[20px]"
                        onDragStart={(e) => e.preventDefault()}
                        />
                    </motion.div>
                    ))}
                </motion.div>

                <SectionTitle className="flex justify-center md:justify-start pl-2 text-lg md:text-2xl md:pl-8 mb-2 md:mb-4 lg:mb-6">
                    Explore Flavours
                </SectionTitle>
                <motion.div 
                    className="flex flex-row md:flex-wrap overflow-x-auto no-scrollbar md:overflow-visible flex-1 md:justify-around items-center gap-4 md:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {flavourImages.map((image) => (
                    <motion.div key={image.id} className="w-24 md:flex-1 md:w-full max-w-xs md:max-w-44 flex-shrink-0 md:flex-shrink aspect-square md:aspect-[5/6]" variants={itemVariants}>
                        <Image
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={400}
                        data-ai-hint={image.hint}
                        className="w-full h-full object-cover rounded-[20px]"
                        onDragStart={(e) => e.preventDefault()}
                        />
                    </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    </motion.div>
  );
}
