"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ArrowDown,
  ArrowUp,
  Fish,
  Heart,
  HeartPulse,
  Leaf,
  Minus,
  ShieldCheck,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { KPICard } from "@/components/kpi-card";
import market from "@/data/market.json";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const {
  meta,
  headline_kpi,
  segment_growth,
  channels,
  online_leaders,
  competitors,
  trends,
  geography,
  whitespace_callout,
} = market;

const TREND_ICON: Record<string, LucideIcon> = {
  Wheat,
  Fish,
  Leaf,
  ShieldCheck,
  HeartPulse,
  Heart,
};

// Map 6 channel keys to colors (navy → gold gradient)
const CHANNEL_COLORS = [
  "#0B1E3F",
  "#3B5166",
  "#5A6B4D",
  "#A88C5F",
  "#B8925A",
  "#D4D0CA",
];

export default function MercatoPage() {
  const growthMax = Math.max(
    ...segment_growth.data.map((s) => Math.abs(s.growth_pct))
  );

  return (
    <div className="container py-8">
      {/* HERO */}
      <AnimatedSection>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="eyebrow text-gold">02 · Analisi di mercato</p>
            <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
              {meta.title}
            </h1>
            <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
              {meta.subtitle}
            </p>
          </div>
          <p className="text-xs text-carbon-muted max-w-xs text-right leading-relaxed">
            {meta.source}
          </p>
        </div>
      </AnimatedSection>

      {/* KPI STRIP */}
      <section className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {headline_kpi.map((k, i) => (
            <KPICard
              key={k.label}
              label={k.label}
              value={k.value}
              unit={k.unit}
              delay={i * 0.15}
            />
          ))}
        </div>
      </section>

      {/* SEGMENT GROWTH */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">Crescita dei segmenti</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          {segment_growth.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {segment_growth.subtitle}
        </p>

        <div className="mt-10 border-y border-hairline">
          {segment_growth.data.map((s, i) => {
            const isTarget = s.segment === "Premium / Holistic";
            const pct = s.growth_pct;
            const color =
              pct < 0
                ? "#7A2E2E"
                : pct > 10
                ? "#B8925A"
                : pct >= 5
                ? "#0B1E3F"
                : "#9CA3AF";
            const widthPct = (Math.abs(pct) / growthMax) * 60;
            return (
              <motion.div
                key={s.segment}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease, delay: i * 0.06 }}
                className={cn(
                  "grid grid-cols-[200px_1fr_100px] items-center gap-6 py-5 border-b border-hairline last:border-b-0",
                  isTarget &&
                    "bg-gold/[0.06] border-l-2 border-gold pl-4 -ml-4"
                )}
              >
                <p
                  className={cn(
                    "text-sm",
                    isTarget ? "text-navy font-medium" : "text-carbon"
                  )}
                >
                  {s.segment}
                </p>
                <div className="flex items-center">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${widthPct}%` }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 1,
                      ease,
                      delay: 0.15 + i * 0.06,
                    }}
                    className="h-2"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-[11px] text-carbon-muted ml-3 max-w-[300px] leading-snug">
                    {s.note}
                  </p>
                </div>
                <p
                  className="text-right font-serif text-xl num"
                  style={{ color }}
                >
                  {pct > 0 ? "+" : ""}
                  {pct}%
                </p>
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* CHANNELS */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">Canali di acquisto</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          {channels.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {channels.subtitle}
        </p>

        <StackedChannelChart />

        <ChannelTable />
      </AnimatedSection>

      {/* ONLINE LEADERS */}
      <AnimatedSection stagger className="mt-24">
        <p className="eyebrow">Chi domina il canale online</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Quattro piattaforme, quattro strategie distinte.
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
          {online_leaders.map((p, i) => (
            <motion.div
              key={p.platform}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="bg-white p-8 flex flex-col"
            >
              <h3 className="font-serif text-xl text-navy leading-tight">
                {p.platform}
              </h3>
              <p className="mt-5 font-serif text-gold text-2xl num">
                {p.purchase_intent_pct}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-micro text-carbon-muted">
                Purchase intent
              </p>
              <p className="mt-5 text-sm text-carbon leading-relaxed">
                {p.strength}
              </p>
              <div className="mt-5 h-px w-8 bg-gold" />
              <p className="mt-auto pt-5 text-[11px] uppercase tracking-micro text-carbon-muted leading-relaxed">
                {p.action}
              </p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* COMPETITORS */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">Competitor analysis</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          {competitors.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {competitors.subtitle}
        </p>

        <div className="mt-10 border border-hairline overflow-x-auto">
          <table className="w-full text-left min-w-[880px]">
            <thead>
              <tr className="border-b border-hairline bg-white">
                <Th className="w-[14%]">Brand</Th>
                <Th className="w-[10%]">Origine</Th>
                <Th className="w-[10%]">Prezzo 2kg</Th>
                <Th className="w-[10%]">Proteina %</Th>
                <Th className="w-[10%]">Grain free</Th>
                <Th className="w-[16%]">Canale</Th>
                <Th className="w-[30%]">Gap vs Alleva</Th>
              </tr>
            </thead>
            <tbody>
              {competitors.data.map((c, i) => {
                const isUs = (c as { is_us?: boolean }).is_us === true;
                return (
                  <motion.tr
                    key={c.brand}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease, delay: i * 0.05 }}
                    className={cn(
                      "border-b border-hairline last:border-b-0 align-top",
                      isUs
                        ? "bg-gold/[0.08] border-l-[3px] border-l-gold"
                        : "bg-white hover:bg-navy/[0.02] transition-colors"
                    )}
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        {isUs && (
                          <span className="inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-micro bg-gold text-white font-medium">
                            Us
                          </span>
                        )}
                        <span
                          className={cn(
                            "font-serif",
                            isUs ? "text-navy font-medium" : "text-navy"
                          )}
                        >
                          {c.brand}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <span className={isUs ? "text-navy" : "text-carbon"}>
                        {c.origin}
                      </span>
                    </Td>
                    <Td className="num">${c.price_2kg_usd}</Td>
                    <Td className="num">{c.protein_pct}%</Td>
                    <Td>{String(c.grain_free)}</Td>
                    <Td>
                      <span className="text-carbon-muted text-[13px]">
                        {c.channel}
                      </span>
                    </Td>
                    <Td>
                      <span
                        className={cn(
                          "text-[13px] leading-relaxed",
                          isUs ? "text-navy" : "text-carbon-muted"
                        )}
                      >
                        {c.gap_vs_alleva}
                      </span>
                    </Td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <blockquote className="mt-8 border-l-2 border-gold pl-6 max-w-[720px]">
          <p className="font-serif italic text-base md:text-[17px] text-navy leading-relaxed">
            {competitors.diusapet_positioning}
          </p>
        </blockquote>
      </AnimatedSection>

      {/* TRENDS */}
      <AnimatedSection stagger className="mt-24">
        <p className="eyebrow">Trend del segmento</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Sei trend che spingono Alleva.
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
          {trends.map((t, i) => {
            const Icon = TREND_ICON[t.icon] ?? Leaf;
            return (
              <motion.div
                key={t.trend}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease, delay: i * 0.06 }}
                className="group relative bg-white p-8 transition-shadow duration-300 hover:shadow-elev"
              >
                <Icon
                  className="h-5 w-5 text-navy"
                  strokeWidth={1.2}
                />
                <h3 className="mt-6 font-serif text-[17px] text-navy leading-snug">
                  {t.trend}
                </h3>
                <p className="mt-3 text-sm text-carbon-muted leading-relaxed">
                  {t.impact}
                </p>
                <span className="absolute left-8 bottom-8 h-px w-6 bg-gold group-hover:w-14 transition-[width] duration-500" />
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* GEOGRAPHY */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">Area geografica target</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          {geography.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {geography.subtitle}
        </p>

        <p className="mt-12 eyebrow">Profilo New Jersey</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline border border-hairline">
          {geography.nj_profile.map((m, i) => (
            <motion.div
              key={m.metric}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease, delay: i * 0.05 }}
              className="bg-white p-6"
            >
              <p className="eyebrow text-carbon-muted leading-snug">
                {m.metric}
              </p>
              <p className="mt-3 font-serif text-xl text-navy num leading-tight">
                {m.value}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-14 eyebrow">Priorità commerciali per zona</p>
        <div className="mt-4 border border-hairline overflow-x-auto">
          <table className="w-full text-left min-w-[820px]">
            <thead>
              <tr className="border-b border-hairline bg-white">
                <Th>Zona</Th>
                <Th>Stato</Th>
                <Th>% Italiani</Th>
                <Th>Reddito</Th>
                <Th>Pet store</Th>
                <Th>Priorità</Th>
                <Th className="w-[30%]">Nota</Th>
              </tr>
            </thead>
            <tbody>
              {geography.zones.map((z, i) => (
                <motion.tr
                  key={z.zone}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, ease, delay: i * 0.04 }}
                  className="border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors"
                >
                  <Td>
                    <span className="font-serif text-navy">{z.zone}</span>
                  </Td>
                  <Td className="num">{z.state}</Td>
                  <Td className="num">{z.italian_pct}%</Td>
                  <Td className="num">{z.income}</Td>
                  <Td className="num">{z.stores}</Td>
                  <Td>
                    <PriorityBadge p={z.priority} />
                  </Td>
                  <Td>
                    <span className="text-xs text-carbon-muted">
                      {z.note}
                    </span>
                  </Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedSection>

      {/* FINAL CALLOUT */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease }}
        className="mt-24 border-l-4 border-gold bg-gold/[0.04] px-6 md:px-10 py-8"
      >
        <p className="eyebrow text-gold">White space</p>
        <p className="mt-3 font-serif text-xl md:text-2xl text-navy leading-relaxed max-w-3xl">
          {whitespace_callout}
        </p>
      </motion.div>
    </div>
  );
}

/* ---------- STACKED CHANNEL CHART ---------- */

function StackedChannelChart() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  const channelsList = channels.data;
  const years = channels.years;

  // Build one row per year
  const rows = years.map((yr) => {
    const row: Record<string, number | string> = { year: yr };
    channelsList.forEach((c) => {
      row[c.channel] = c[`share_${yr}` as keyof typeof c] as number;
    });
    return row;
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7, ease }}
      className="mt-10 h-[280px] border border-hairline bg-white p-6"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" stackOffset="expand">
          <CartesianGrid stroke="#E6E8EC" horizontal={false} />
          <XAxis
            type="number"
            stroke="#5B6470"
            tickLine={false}
            axisLine={false}
            fontSize={11}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <YAxis
            type="category"
            dataKey="year"
            stroke="#5B6470"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            width={48}
          />
          <Tooltip
            formatter={(v: number) => `${v}%`}
            contentStyle={{
              border: "1px solid #E6E8EC",
              background: "white",
              fontSize: 12,
              borderRadius: 0,
            }}
          />
          {channelsList.map((c, i) => (
            <Bar
              key={c.channel}
              dataKey={c.channel}
              stackId="a"
              fill={CHANNEL_COLORS[i]}
              isAnimationActive={inView}
              animationDuration={1200}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function ChannelTable() {
  return (
    <div className="mt-8 border border-hairline overflow-x-auto">
      <table className="w-full text-left min-w-[820px]">
        <thead>
          <tr className="border-b border-hairline bg-white">
            <Th className="w-[28%]">Canale</Th>
            <Th className="w-[8%] text-right">2015</Th>
            <Th className="w-[8%] text-right">2019</Th>
            <Th className="w-[8%] text-right">2025</Th>
            <Th className="w-[10%]">Trend</Th>
            <Th className="w-[38%]">Azione Diusapet</Th>
          </tr>
        </thead>
        <tbody>
          {channels.data.map((c, i) => (
            <motion.tr
              key={c.channel}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease, delay: i * 0.04 }}
              className="border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors"
            >
              <Td>
                <span className="font-serif text-navy">{c.channel}</span>
              </Td>
              <Td className="num text-right text-carbon-muted">
                {c.share_2015}%
              </Td>
              <Td className="num text-right text-carbon-muted">
                {c.share_2019}%
              </Td>
              <Td className="num text-right text-navy">{c.share_2025}%</Td>
              <Td>
                <TrendPill trend={c.trend} />
              </Td>
              <Td>
                <span className="italic text-xs text-carbon-muted">
                  {c.action}
                </span>
              </Td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrendPill({ trend }: { trend: string }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-navy">
        <ArrowUp className="h-3 w-3" strokeWidth={2} />
        In crescita
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[#7A2E2E]">
        <ArrowDown className="h-3 w-3" strokeWidth={2} />
        In calo
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-carbon-muted">
      <Minus className="h-3 w-3" strokeWidth={2} />
      Stabile
    </span>
  );
}

function PriorityBadge({ p }: { p: number }) {
  const map: Record<number, string> = {
    1: "bg-gold text-white border-gold",
    2: "text-navy border-navy",
    3: "text-carbon-muted border-hairline",
  };
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-[10px] uppercase tracking-micro border num",
        map[p] ?? map[3]
      )}
    >
      P{p}
    </span>
  );
}

/* ---------- table primitives ---------- */

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("eyebrow text-left p-4 font-normal", className)}>
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("p-4 text-sm text-carbon", className)}>{children}</td>
  );
}
