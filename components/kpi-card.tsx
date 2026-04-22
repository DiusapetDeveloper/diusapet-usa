"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  caption?: string;
  delay?: number;
  className?: string;
};

type NumericParts = { prefix: string; number: number; suffix: string };

function parseNumeric(v: string | number): NumericParts | null {
  if (typeof v === "number") return { prefix: "", number: v, suffix: "" };
  // Strict: optional $/+/-, then a single number, then only short unit suffix (%, B, k, K, M, m). No dashes / ranges.
  const m = v.match(/^([$+\-]?)(\d+(?:\.\d+)?)([%BKkMm]*)$/);
  if (!m) return null;
  return { prefix: m[1], number: parseFloat(m[2]), suffix: m[3] };
}

const COUNT_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BORDER_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

export function KPICard({
  label,
  value,
  unit,
  trend,
  caption,
  delay = 0,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.35, triggerOnce: true });
  const parts = parseNumeric(value);
  const numeric = parts !== null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(
        "group relative flex flex-col justify-between h-full p-8 bg-white",
        className
      )}
    >
      {/* SVG gold border that draws in */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="#B8925A"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          initial={{ strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: inView ? 0 : 1 }}
          transition={{ duration: 0.7, ease: BORDER_EASE, delay }}
        />
      </svg>

      <div className="relative z-10 eyebrow">{label}</div>

      <div className="relative z-10 mt-8 flex items-baseline gap-0.5 num">
        {numeric ? (
          <NumericValue
            parts={parts!}
            inView={inView}
            reduce={!!reduce}
            delay={delay}
          />
        ) : (
          <motion.span
            initial={{ opacity: 0, scale: 0.94 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delay + 0.2 }}
            className="font-serif text-5xl md:text-6xl text-navy leading-none"
          >
            {String(value)}
          </motion.span>
        )}
        {unit && (
          <span className="font-serif text-2xl md:text-3xl text-navy/75 ml-1">
            {unit}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-between gap-4">
        {trend && (
          <span className="text-xs tracking-tight text-carbon-muted">
            {trend}
          </span>
        )}
        <span className="h-px w-8 bg-gold group-hover:w-14 transition-[width] duration-500" />
      </div>

      {caption && (
        <p className="relative z-10 mt-3 text-xs text-carbon-muted leading-relaxed">
          {caption}
        </p>
      )}
    </motion.div>
  );
}

function NumericValue({
  parts,
  inView,
  reduce,
  delay,
}: {
  parts: NumericParts;
  inView: boolean;
  reduce: boolean;
  delay: number;
}) {
  const { prefix, number, suffix } = parts;
  const mv = useMotionValue(0);
  const isInt = Number.isInteger(number);
  const rounded = useTransform(mv, (v) =>
    isInt ? Math.round(v).toString() : v.toFixed(1)
  );
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(number);
      setFlashing(true);
      const t = window.setTimeout(() => setFlashing(false), 200);
      return () => window.clearTimeout(t);
    }
    const controls = animate(mv, number, {
      duration: 1.4,
      ease: COUNT_EASE,
      delay,
    });
    const flashTimer = window.setTimeout(
      () => setFlashing(true),
      (delay + 1.4) * 1000
    );
    const flashEnd = window.setTimeout(
      () => setFlashing(false),
      (delay + 1.4) * 1000 + 200
    );
    return () => {
      controls.stop();
      window.clearTimeout(flashTimer);
      window.clearTimeout(flashEnd);
    };
  }, [inView, number, mv, delay, reduce]);

  return (
    <motion.span
      animate={
        flashing
          ? {
              scale: [1, 1.03, 1],
              boxShadow: [
                "0 0 0 0 rgba(184, 146, 90, 0)",
                "0 0 0 10px rgba(184, 146, 90, 0.18)",
                "0 0 0 0 rgba(184, 146, 90, 0)",
              ],
            }
          : { scale: 1, boxShadow: "0 0 0 0 rgba(184, 146, 90, 0)" }
      }
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-baseline gap-0.5 font-serif text-5xl md:text-6xl text-navy leading-none"
      style={{ borderRadius: 2 }}
    >
      {prefix && <span>{prefix}</span>}
      <motion.span>{rounded}</motion.span>
      {suffix && <span className="text-navy/80">{suffix}</span>}
    </motion.span>
  );
}
