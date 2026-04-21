"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type Risk = {
  area: string;
  risk: string;
  probability: "Bassa" | "Media" | "Alta" | string;
  impact: "Basso" | "Medio" | "Alto" | string;
  mitigation: string;
};

function tone(level: string) {
  if (level === "Alta" || level === "Alto") return "text-navy font-medium";
  if (level === "Media" || level === "Medio") return "text-carbon";
  return "text-carbon-muted";
}

function dot(level: string) {
  if (level === "Alta" || level === "Alto") return "bg-gold";
  if (level === "Media" || level === "Medio") return "bg-navy/60";
  return "bg-hairline";
}

export function RiskMatrix({ risks }: { risks: Risk[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div ref={ref} className="border border-hairline overflow-hidden">
      <div className="grid grid-cols-12 border-b border-hairline bg-white">
        <div className="col-span-2 p-4 eyebrow">Area</div>
        <div className="col-span-4 p-4 eyebrow">Rischio</div>
        <div className="col-span-1 p-4 eyebrow">Prob.</div>
        <div className="col-span-1 p-4 eyebrow">Impatto</div>
        <div className="col-span-4 p-4 eyebrow">Mitigazione</div>
      </div>
      {risks.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.05,
          }}
          className={cn(
            "grid grid-cols-12 border-b border-hairline last:border-b-0 hover:bg-navy/[0.02] transition-colors"
          )}
        >
          <div className="col-span-2 p-4 text-sm text-navy">{r.area}</div>
          <div className="col-span-4 p-4 text-sm text-carbon">{r.risk}</div>
          <div className="col-span-1 p-4 text-sm flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", dot(r.probability))} />
            <span className={tone(r.probability)}>{r.probability}</span>
          </div>
          <div className="col-span-1 p-4 text-sm flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", dot(r.impact))} />
            <span className={tone(r.impact)}>{r.impact}</span>
          </div>
          <div className="col-span-4 p-4 text-sm text-carbon-muted leading-relaxed">
            {r.mitigation}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
