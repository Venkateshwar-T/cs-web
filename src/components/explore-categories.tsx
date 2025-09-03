
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
      className="bg-[#5D2B79] h-full rounded-t-[20px] md:rounded-t-[40px] mx-4 md:mx-32"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
    >
        <div className="bg-white/20 h-full rounded-t-[20px] md:rounded-t-[40px] py-6 px-4 md:px-12 overflow-y-auto no-scrollbar">
            <SectionTitle className="pl-2 md:pl-8">
                Explore Categories
            </SectionTitle>
            <motion.div 
                className="flex flex-1 justify-around items-center gap-2 md:gap-8 pt-2 pb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {categoryImages.map((image) => (
                <motion.div key={image.id} className="flex-1 max-w-24 md:max-w-64 aspect-[5/6]" variants={itemVariants}>
                    <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    data-ai-hint={image.hint}
                    className="w-full h-full object-cover rounded-[20px] md:rounded-[40px]"
                    onDragStart={(e) => e.preventDefault()}
                    />
                </motion.div>
                ))}
            </motion.div>

            <SectionTitle className="pl-2 md:pl-8">
                Explore Flavours
            </SectionTitle>
            <motion.div 
                className="flex flex-1 justify-around items-center gap-2 md:gap-8 pt-2 pb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {flavourImages.map((image) => (
                <motion.div key={image.id} className="flex-1 max-w-16 md:max-w-44 aspect-[5/6]" variants={itemVariants}>
                    <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    data-ai-hint={image.hint}
                    className="w-full h-full object-cover rounded-[20px] md:rounded-[40px]"
                    onDragStart={(e) => e.preventDefault()}
                    />
                </motion.div>
                ))}
            </motion.div>
        </div>
    </motion.div>
  );
}
