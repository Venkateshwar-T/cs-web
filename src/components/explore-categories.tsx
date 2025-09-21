
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

interface ExploreItem {
  _key: string;
  name: string;
  imageUrl: string;
}

interface ExploreCategoriesProps {
  exploreCategories: ExploreItem[];
  exploreFlavours: ExploreItem[];
}

export function ExploreCategories({ exploreCategories, exploreFlavours }: ExploreCategoriesProps) {
  return (
    <motion.div 
      className="bg-[#5D2B79] h-full rounded-t-[25px] md:rounded-t-[40px] mx-4 md:mx-32"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
    >
        <div className="bg-white/20 h-full rounded-t-[25px] md:rounded-t-[40px] px-4 md:px-12 flex flex-col">
            <div className="flex-grow overflow-y-auto no-scrollbar min-h-0">
                <SectionTitle className="flex justify-center md:justify-start text-lg pt-4 md:pt-6 md:text-2xl md:pl-8 mb-2 md:mb-6">
                    Explore Categories
                </SectionTitle>
                <motion.div 
                    className="grid grid-cols-2 md:flex md:flex-row flex-1 justify-around items-center gap-4 md:gap-6 pt-1 pb-6 md:pb-12 px-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {(exploreCategories || []).map((category) => (
                    <motion.div key={category._key} className="w-full aspect-[5/6] relative group" variants={itemVariants}>
                        <Image
                        src={category.imageUrl}
                        alt={category.name}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover rounded-[20px] md:rounded-[40px] ring-1 ring-custom-purple-dark"
                        onDragStart={(e) => e.preventDefault()}
                        />
                        <div className="absolute inset-x-0 bottom-2 md:bottom-3 flex items-end justify-center">
                          <h3 className="text-white text-xs md:text-lg text-center font-plex-sans font-semibold [text-shadow:0_2px_1px_rgba(0,0,0,1)]">{category.name}</h3>
                        </div>
                    </motion.div>
                    ))}
                </motion.div>

                <SectionTitle className="flex justify-center md:justify-start text-lg md:text-2xl mb-2 md:mb-4 md:pl-8">
                    Explore Flavours
                </SectionTitle>
                <motion.div 
                    className="flex flex-row md:flex-wrap overflow-x-auto no-scrollbar md:overflow-visible flex-1 md:justify-around items-center gap-4 md:gap-8 px-2 md:px-0 pb-4 md:pb-6 pt-1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {(exploreFlavours || []).map((flavour) => (
                    <motion.div key={flavour._key} className="w-24 md:flex-1 md:w-full max-w-xs md:max-w-48 flex-shrink-0 md:flex-shrink aspect-square md:aspect-[5/6] relative group" variants={itemVariants}>
                        <Image
                        src={flavour.imageUrl}
                        alt={flavour.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover rounded-[20px] md:rounded-[40px] ring-1 ring-custom-purple-dark"
                        onDragStart={(e) => e.preventDefault()}
                        />
                        <div className="absolute inset-x-0 bottom-2 md:bottom-3 flex items-end justify-center">
                            <h3 className="text-white text-xs md:text-lg text-center font-plex-sans font-semibold [text-shadow:0_2px_1px_rgba(0,0,0,1)]">{flavour.name}</h3>
                        </div>
                    </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    </motion.div>
  );
}
