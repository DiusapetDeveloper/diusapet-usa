"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

type Item = { label: string; title: string; detail: string };

export function Timeline({ items }: { items: Item[] }) {
  return (
    <ol className="relative border-l border-hairline pl-8 md:pl-10 space-y-10">
      <span className="absolute left-0 top-0 bottom-0 w-px bg-hairline" />
      {items.map((item, i) => (
        <TimelineItem key={i} item={item} index={i} />
      ))}
    </ol>
  );
}

function TimelineItem({ item, index }: { item: Item; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.04,
      }}
      className="relative"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04 + 0.1 }}
        className="absolute -left-[33px] md:-left-[41px] top-1.5 h-2.5 w-2.5 rounded-full bg-navy ring-4 ring-white"
      />
      <p className="eyebrow text-gold">{item.label}</p>
      <h3 className="mt-1 font-serif text-2xl text-navy">{item.title}</h3>
      <p className="mt-2 text-carbon-muted max-w-xl leading-relaxed">
        {item.detail}
      </p>
    </motion.li>
  );
}
