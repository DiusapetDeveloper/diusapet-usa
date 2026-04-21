"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "section" | "div" | "article" | "header";
  stagger?: boolean;
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const child: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
  },
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  as = "section",
  stagger = false,
}: Props) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const MotionTag = motion[as];

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  if (stagger) {
    return (
      <MotionTag
        ref={ref}
        className={cn(className)}
        variants={container}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </MotionTag>
  );
}

export const fadeUpChild: Variants = child;
