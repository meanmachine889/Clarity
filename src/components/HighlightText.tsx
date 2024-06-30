"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";

export function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className=" px-4 md:text-5xl text-3xl lg:text-5xl font-bold text-neutral-700 dark:text-gray-300 max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        pdfs too boring? make them interactive chats with<br/>
        <Highlight className="text-black md:text-9xl text-6xl dark:text-white">
          clarity
        </Highlight>
      </motion.h1>
    </HeroHighlight>
  );
}
