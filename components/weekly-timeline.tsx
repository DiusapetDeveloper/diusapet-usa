"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

type Block = { time: string; activity: string; category: string };

type Day = {
  day: string;
  day_short: string;
  focus: string;
  blocks: Block[];
  total_hours: number;
  note?: string;
};

type Category = { label: string; color: string };

type Props = {
  days: Day[];
  categories: Record<string, Category>;
};

export function WeeklyTimeline({ days, categories }: Props) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (dayKey: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(dayKey)) next.delete(dayKey);
      else next.add(dayKey);
      return next;
    });

  return (
    <div ref={ref}>
      {/* DESKTOP: 7-column grid */}
      <div className="hidden lg:grid grid-cols-7 gap-px bg-hairline border border-hairline">
        {days.map((d, i) => (
          <DayColumn
            key={DAY_KEYS[i]}
            day={d}
            dayKey={DAY_KEYS[i]}
            categories={categories}
            index={i}
            inView={inView}
            reduce={!!reduce}
          />
        ))}
      </div>

      {/* MOBILE: accordion */}
      <div className="lg:hidden border border-hairline divide-y divide-hairline">
        {days.map((d, i) => (
          <DayAccordion
            key={DAY_KEYS[i]}
            day={d}
            dayKey={DAY_KEYS[i]}
            categories={categories}
            isOpen={open.has(DAY_KEYS[i])}
            onToggle={() => toggle(DAY_KEYS[i])}
            index={i}
            inView={inView}
            reduce={!!reduce}
          />
        ))}
      </div>
    </div>
  );
}

function DayColumn({
  day,
  dayKey,
  categories,
  index,
  inView,
  reduce,
}: {
  day: Day;
  dayKey: string;
  categories: Record<string, Category>;
  index: number;
  inView: boolean;
  reduce: boolean;
}) {
  const tMd = useTranslations("operativo.mdWeek");
  const tOp = useTranslations("operativo.timeline");

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={
        inView || reduce
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 20 }
      }
      transition={{
        duration: 0.6,
        ease,
        delay: reduce ? 0 : index * 0.08,
      }}
      className="bg-white p-5 flex flex-col min-h-[480px]"
    >
      <header className="pb-4 border-b border-hairline">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-[18px] text-navy leading-none">
            {tMd(`days.${dayKey}`)}
          </h3>
          <span className="text-[10px] uppercase tracking-micro text-carbon-muted">
            {day.day_short}
          </span>
        </div>
        <p className="mt-2 text-[11px] italic text-carbon-muted leading-snug">
          {day.focus}
        </p>
      </header>

      <div className="mt-4 flex flex-col gap-2">
        {day.blocks.map((b, bi) => {
          const cat = categories[b.category];
          const catLabel = tMd(`categories.${b.category}`);
          return (
            <motion.div
              key={`${dayKey}-${bi}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={
                inView || reduce
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{
                duration: 0.4,
                ease,
                delay: reduce ? 0 : index * 0.08 + 0.25 + bi * 0.04,
              }}
              className="py-2.5 px-3 border-l-[3px] bg-navy/[0.01]"
              style={{
                borderLeftColor: cat?.color ?? "#E6E8EC",
              }}
              aria-label={`${b.time} — ${b.activity} — ${catLabel}`}
            >
              <p className="font-mono text-[11px] text-carbon-muted tracking-tight num">
                {b.time}
              </p>
              <p className="mt-1 font-serif text-[13px] text-navy leading-snug">
                {b.activity}
              </p>
            </motion.div>
          );
        })}
      </div>

      <footer className="mt-auto pt-4 border-t border-hairline">
        <p className="text-[11px] text-carbon-muted num">
          {tOp("totalLabel")}: {day.total_hours}h
        </p>
        {day.note && (
          <p className="mt-2 text-[11px] italic text-carbon-muted leading-snug">
            {day.note}
          </p>
        )}
      </footer>
    </motion.div>
  );
}

function DayAccordion({
  day,
  dayKey,
  categories,
  isOpen,
  onToggle,
  index,
  inView,
  reduce,
}: {
  day: Day;
  dayKey: string;
  categories: Record<string, Category>;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  inView: boolean;
  reduce: boolean;
}) {
  const tMd = useTranslations("operativo.mdWeek");

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={
        inView || reduce
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 10 }
      }
      transition={{
        duration: 0.5,
        ease,
        delay: reduce ? 0 : index * 0.06,
      }}
      className="bg-white"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-navy/[0.02] transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <h3 className="font-serif text-lg text-navy leading-none">
              {tMd(`days.${dayKey}`)}
            </h3>
            <span className="text-[10px] uppercase tracking-micro text-carbon-muted num">
              {day.total_hours}h
            </span>
          </div>
          <p className="mt-1.5 text-xs italic text-carbon-muted">
            {day.focus}
          </p>
        </div>
        <ChevronDown
          strokeWidth={1.5}
          className={cn(
            "h-4 w-4 shrink-0 text-carbon-muted transition-transform duration-300 mt-1",
            isOpen && "rotate-180 text-navy"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-2">
              {day.blocks.map((b, bi) => {
                const cat = categories[b.category];
                const catLabel = tMd(`categories.${b.category}`);
                return (
                  <div
                    key={`${dayKey}-${bi}`}
                    className="py-2.5 px-3 border-l-[3px] bg-navy/[0.02]"
                    style={{
                      borderLeftColor: cat?.color ?? "#E6E8EC",
                    }}
                    aria-label={`${b.time} — ${b.activity} — ${catLabel}`}
                  >
                    <p className="font-mono text-[11px] text-carbon-muted tracking-tight num">
                      {b.time}
                    </p>
                    <p className="mt-1 font-serif text-sm text-navy leading-snug">
                      {b.activity}
                    </p>
                  </div>
                );
              })}
              {day.note && (
                <p className="mt-2 text-[11px] italic text-carbon-muted leading-snug">
                  {day.note}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
