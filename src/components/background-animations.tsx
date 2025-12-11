"use client";

import { motion } from "motion/react";

export function BackgroundAnimations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="-left-20 -top-32 absolute h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/10"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="-right-20 absolute top-1/4 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[100px] dark:bg-secondary/10"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="-bottom-32 -translate-x-1/2 absolute left-1/2 h-[600px] w-[600px] rounded-full bg-accent/20 blur-[140px] dark:bg-accent/10"
      />
      {/* Additional gradient for light mode enhancement */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-1/3 left-1/4 h-[350px] w-[350px] rounded-full bg-emerald-400/10 blur-[100px] dark:bg-emerald-500/5"
      />
    </div>
  );
}
