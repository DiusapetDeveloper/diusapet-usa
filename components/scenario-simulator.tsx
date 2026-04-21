"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import financials from "@/data/financials.json";
import { cn, formatCurrency } from "@/lib/utils";

type ScenarioKey = "pessimistic" | "base" | "optimistic";
const ORDER: ScenarioKey[] = ["pessimistic", "base", "optimistic"];

export function ScenarioSimulator() {
  const [idx, setIdx] = useState(1);
  const [growth, setGrowth] = useState(100);
  const [price, setPrice] = useState(100);

  const scenario = financials.scenarios[ORDER[idx]];

  const pl = useMemo(() => {
    const g = growth / 100;
    const p = price / 100;
    const revY1 = scenario.revenues.y1 * g * p;
    const revY2 = scenario.revenues.y2 * g * p;
    const revY3 = scenario.revenues.y3 * g * p;
    const margin = 0.44 + (scenario.marginDelta || 0);
    const gp = revY1 * margin;
    const fixed = financials.monthlyFixedCosts * 12;
    const ebitdaY1 = gp - fixed;
    const breakEven = Math.max(
      6,
      Math.round(scenario.breakEvenMonth / (g * p) / Math.max(0.85, margin / 0.44))
    );
    return { revY1, revY2, revY3, ebitdaY1, breakEven, margin };
  }, [scenario, growth, price]);

  return (
    <div className="grid lg:grid-cols-5 gap-8 border border-hairline p-8 bg-white">
      <div className="lg:col-span-2 space-y-10">
        <div>
          <p className="eyebrow mb-4">Scenario</p>
          <div className="flex items-center gap-1 p-1 border border-hairline w-fit">
            {ORDER.map((key, i) => (
              <button
                key={key}
                onClick={() => setIdx(i)}
                className={cn(
                  "relative px-4 py-2 text-sm tracking-tight transition-colors",
                  i === idx ? "text-white" : "text-carbon-muted hover:text-navy"
                )}
              >
                {i === idx && (
                  <motion.span
                    layoutId="scenario-pill"
                    className="absolute inset-0 bg-navy"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative z-10">
                  {financials.scenarios[key].label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <SliderRow
          label="Tasso crescita"
          value={growth}
          onChange={setGrowth}
          min={60}
          max={140}
          suffix="%"
        />
        <SliderRow
          label="Leva di pricing"
          value={price}
          onChange={setPrice}
          min={85}
          max={120}
          suffix="%"
        />

        <p className="text-xs text-carbon-muted leading-relaxed">
          Lo scenario altera crescita volumi e margini. I cursori applicano un
          override addizionale ± per test what-if.
        </p>
      </div>

      <div className="lg:col-span-3 grid grid-cols-2 gap-4">
        <Metric label="Ricavi Y1" value={pl.revY1} />
        <Metric label="Ricavi Y2" value={pl.revY2} />
        <Metric label="Ricavi Y3" value={pl.revY3} />
        <Metric label="EBITDA Y1" value={pl.ebitdaY1} />
        <Metric
          label="Margine lordo"
          custom={`${(pl.margin * 100).toFixed(1)}%`}
        />
        <Metric label="Break-even" custom={`Mese ${pl.breakEven}`} />
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <span className="eyebrow">{label}</span>
        <span className="num font-serif text-2xl text-navy">
          {value}
          {suffix}
        </span>
      </div>
      <SliderPrimitive.Root
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={min}
        max={max}
        step={1}
        className="relative flex items-center h-5 w-full select-none touch-none"
      >
        <SliderPrimitive.Track className="relative h-px w-full bg-hairline">
          <SliderPrimitive.Range className="absolute h-px bg-navy" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block h-4 w-4 rounded-full bg-navy border border-navy outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          aria-label={label}
        />
      </SliderPrimitive.Root>
    </div>
  );
}

function Metric({
  label,
  value,
  custom,
}: {
  label: string;
  value?: number;
  custom?: string;
}) {
  const display = custom ?? formatCurrency(value ?? 0, { compact: true });
  return (
    <div className="border border-hairline p-5 bg-white">
      <p className="eyebrow">{label}</p>
      <AnimatePresence mode="popLayout">
        <motion.p
          key={display}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-serif text-3xl text-navy num"
        >
          {display}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
