"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import financials from "@/data/financials.json";
import { cn, formatCurrency } from "@/lib/utils";

type ScenarioKey = "pessimistic" | "base" | "optimistic";
const ORDER: ScenarioKey[] = ["pessimistic", "base", "optimistic"];

const MARGIN_FALLBACK: Record<ScenarioKey, number> = {
  pessimistic: 41,
  base: 44,
  optimistic: 47,
};

// Map scenario key to assumption translation key
const ASSUMPTION_KEYS: Record<ScenarioKey, string> = {
  pessimistic: "pessimistic",
  base: "base",
  optimistic: "optimistic",
};

export function ScenarioSimulator() {
  const t = useTranslations("finanziario.simulator");
  const tScenarios = useTranslations("finanziario.scenarios");
  const tKpi = useTranslations("finanziario.kpi");
  const [idx, setIdx] = useState(1);
  const [revenueAdj, setRevenueAdj] = useState(100);
  const [priceAdj, setPriceAdj] = useState(100);

  const key = ORDER[idx];
  const scenario = financials.scenarios[key];

  const pl = useMemo(() => {
    const rev = revenueAdj / 100;
    const pr = priceAdj / 100;

    const baseMargin =
      (scenario as any).gross_margin_pct ?? MARGIN_FALLBACK[key];
    const marginPct = Math.max(
      25,
      Math.min(60, baseMargin + (priceAdj - 100) * 0.5)
    );

    const revY1 = scenario.revenue_y1 * rev * pr;
    const revY2 = scenario.revenue_y2 * rev * pr;
    const revY3 = scenario.revenue_y3 * rev * pr;

    const baseGP = scenario.revenue_y1 * (baseMargin / 100);
    const newGP = revY1 * (marginPct / 100);
    const ebitdaY1 = scenario.ebitda_y1 + (newGP - baseGP);

    const be = scenario.breakeven_month;
    const breakEven =
      be == null
        ? tKpi("notAvailable")
        : `${tKpi("monthPrefix")} ${Math.max(
            6,
            Math.round(
              be /
                Math.max(0.6, rev * pr) /
                Math.max(0.85, marginPct / baseMargin)
            )
          )}`;

    return { revY1, revY2, revY3, ebitdaY1, marginPct, breakEven };
  }, [scenario, key, revenueAdj, priceAdj, tKpi]);

  return (
    <div className="grid lg:grid-cols-5 gap-8 border border-hairline p-8 bg-white">
      <div className="lg:col-span-2 space-y-10">
        <div>
          <p className="eyebrow mb-4">{t("scenarioLabel")}</p>
          <div className="flex items-center gap-1 p-1 border border-hairline w-fit">
            {ORDER.map((k, i) => (
              <button
                key={k}
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
                  {tScenarios(ASSUMPTION_KEYS[k])}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-carbon-muted leading-relaxed max-w-md">
            {scenario.assumption}
          </p>
        </div>

        <SliderRow
          label={t("volumeSlider")}
          value={revenueAdj}
          onChange={setRevenueAdj}
          min={80}
          max={120}
          suffix="%"
        />
        <SliderRow
          label={t("priceSlider")}
          value={priceAdj}
          onChange={setPriceAdj}
          min={90}
          max={110}
          suffix="%"
        />

        <p className="text-xs text-carbon-muted leading-relaxed">
          {t("note")}
        </p>
      </div>

      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
        <Metric label={t("metrics.revenueY1")} value={pl.revY1} />
        <Metric label={t("metrics.revenueY2")} value={pl.revY2} />
        <Metric label={t("metrics.revenueY3")} value={pl.revY3} />
        <Metric label={t("metrics.ebitdaY1")} value={pl.ebitdaY1} />
        <Metric
          label={t("metrics.margin")}
          custom={`${pl.marginPct.toFixed(1)}%`}
        />
        <Metric label={t("metrics.breakeven")} custom={pl.breakEven} />
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
          className="mt-4 font-serif text-2xl text-navy num"
        >
          {display}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
