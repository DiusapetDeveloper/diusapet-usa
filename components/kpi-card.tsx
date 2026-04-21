"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value?: number;
  valueRange?: [number, number];
  prefix?: string;
  suffix?: string;
  trend?: string;
  caption?: string;
  delay?: number;
  className?: string;
};

export function KPICard({
  label,
  value,
  valueRange,
  prefix = "",
  suffix = "",
  trend,
  caption,
  delay = 0,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.35, triggerOnce: true });

  const target = valueRange ? valueRange[1] : value ?? 0;
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    Number.isInteger(target) ? Math.round(v).toString() : v.toFixed(1)
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(target);
      return;
    }
    const controls = animate(mv, target, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      delay,
    });
    return () => controls.stop();
  }, [inView, target, mv, delay, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(
        "group relative flex flex-col justify-between h-full p-8 bg-white border border-hairline",
        "transition-shadow duration-500 hover:shadow-elev",
        className
      )}
    >
      <div className="eyebrow">{label}</div>

      <div className="mt-8 flex items-baseline gap-1 num">
        {prefix && (
          <span className="font-serif text-4xl md:text-5xl text-navy">
            {prefix}
          </span>
        )}
        <motion.span className="font-serif text-5xl md:text-6xl text-navy">
          {rounded}
        </motion.span>
        {valueRange && (
          <span className="font-serif text-3xl md:text-4xl text-navy/70">
            –{valueRange[1]}
          </span>
        )}
        {suffix && (
          <span className="font-serif text-3xl md:text-4xl text-navy/80 ml-0.5">
            {suffix}
          </span>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {trend && (
          <span className="text-xs tracking-tight text-carbon-muted">
            {trend}
          </span>
        )}
        <span className="h-px w-8 bg-gold group-hover:w-14 transition-[width] duration-500" />
      </div>

      {caption && (
        <p className="mt-3 text-xs text-carbon-muted leading-relaxed">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
