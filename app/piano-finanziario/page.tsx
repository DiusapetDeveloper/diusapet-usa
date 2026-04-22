"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { ScenarioSimulator } from "@/components/scenario-simulator";
import financials from "@/data/financials.json";
import { cn, formatCurrency } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const { meta, recalibration_levers, monthly_base, investment_breakdown, feasibility_dimensions } =
  financials;

const totalInvestment = investment_breakdown.reduce((s, x) => s + x.usd, 0);
const breakevenMonth = monthly_base.find((m: any) => m.breakeven)?.month;

function signedDollarsK(value: number) {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}$${Math.abs(Math.round(value / 1000))}k`;
}

export default function PianoFinanziarioPage() {
  const chart = useInView({ threshold: 0.25, triggerOnce: true });

  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">04 · Piano finanziario</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          {meta.title}
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          {meta.subtitle}
        </p>
        <p className="mt-4 text-xs text-carbon-muted leading-relaxed max-w-2xl">
          {meta.recalibration_note}
        </p>
      </AnimatedSection>

      <AnimatedSection
        stagger
        className="mt-16 grid md:grid-cols-3 gap-px bg-hairline border border-hairline"
      >
        <HeroKpi
          label="Investimento iniziale"
          value={formatCurrency(meta.initial_investment_usd)}
          caption="Setup legale, primo inventory, buffer 4 mesi, contingency."
        />
        <HeroKpi
          label="Costi fissi mensili"
          value={formatCurrency(meta.monthly_fixed_costs_usd)}
          caption="Team lean, 3PL Linden, trade marketing, compliance."
        />
        <HeroKpi
          label="Break-even"
          value={breakevenMonth ? `Mese ${breakevenMonth}` : "n/d"}
          caption={`ROI 3Y +112% · feasibility score ${meta.feasibility_score}/100.`}
        />
      </AnimatedSection>

      {/* 5 LEVE DI RICALIBRAZIONE */}
      <AnimatedSection stagger className="mt-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Ricalibrazione</p>
            <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
              Cinque leve operative che spostano il piano da 70/100 a 82/100.
            </h2>
          </div>
        </div>

        <div className="mt-12 border border-hairline">
          {recalibration_levers.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease, delay: i * 0.06 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-0 border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors p-6 lg:p-0"
            >
              <div className="lg:col-span-1 lg:p-8">
                <p className="font-serif text-4xl text-navy num">
                  0{l.id}
                </p>
              </div>
              <div className="lg:col-span-5 lg:p-8">
                <h3 className="font-serif text-2xl text-navy leading-tight">
                  {l.name}
                </h3>
                <p className="mt-3 text-sm text-carbon-muted leading-relaxed">
                  {l.description}
                </p>
              </div>
              <div className="lg:col-span-3 lg:p-8">
                <p className="eyebrow">Impatto EBITDA Y1</p>
                <p className="mt-3 font-serif text-3xl text-gold num">
                  {signedDollarsK(l.impact_ebitda_y1_usd)}
                </p>
              </div>
              <div className="lg:col-span-3 lg:p-8">
                <p className="eyebrow">Rischio</p>
                <p className="mt-3 text-sm text-carbon leading-relaxed">
                  {l.risk}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* SIMULATORE SCENARI */}
      <section className="mt-28">
        <p className="eyebrow">Simulatore scenari</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Pessimistico, base, ottimistico — con override what-if.
        </h2>
        <div className="mt-10">
          <ScenarioSimulator />
        </div>
      </section>

      {/* CONVERGENZA EBITDA */}
      <section className="mt-28">
        <p className="eyebrow">Convergenza EBITDA</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Dal primo mese al break-even operativo.
        </h2>

        <motion.div
          ref={chart.ref}
          initial={{ opacity: 0, y: 30 }}
          animate={chart.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease }}
          className="mt-8 h-[440px] border border-hairline bg-white p-6"
        >
          <div className="flex items-center gap-6 mb-4">
            <Legend color="#0B1E3F" label="EBITDA mensile" />
            <Legend color="#B8925A" label="EBITDA cumulato" dashed />
          </div>
          <ResponsiveContainer width="100%" height="88%">
            <LineChart data={monthly_base}>
              <CartesianGrid stroke="#E6E8EC" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#5B6470"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(v) => `M${v}`}
              />
              <YAxis
                yAxisId="left"
                stroke="#5B6470"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#5B6470"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid #E6E8EC",
                  background: "white",
                  fontSize: 12,
                  borderRadius: 0,
                }}
                formatter={(v: number) =>
                  formatCurrency(v, { compact: true })
                }
                labelFormatter={(v) => `Mese ${v}`}
              />
              <ReferenceLine
                yAxisId="left"
                y={0}
                stroke="#E6E8EC"
              />
              {breakevenMonth && (
                <ReferenceLine
                  yAxisId="left"
                  x={breakevenMonth}
                  stroke="#B8925A"
                  strokeDasharray="2 4"
                >
                  <Label
                    value={`Break-even · M${breakevenMonth}`}
                    position="insideTopRight"
                    fill="#B8925A"
                    fontSize={11}
                    offset={8}
                  />
                </ReferenceLine>
              )}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="ebitda"
                stroke="#0B1E3F"
                strokeWidth={1.8}
                dot={false}
                isAnimationActive={chart.inView}
                animationDuration={1400}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cum_ebitda"
                stroke="#B8925A"
                strokeWidth={1.8}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={chart.inView}
                animationDuration={1600}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* BREAKDOWN INVESTIMENTO */}
      <AnimatedSection stagger className="mt-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Breakdown investimento</p>
            <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
              Come sono allocati i {formatCurrency(totalInvestment)} iniziali.
            </h2>
          </div>
        </div>

        <div className="mt-10 border border-hairline bg-white">
          {investment_breakdown.map((it, i) => {
            const pct = (it.usd / totalInvestment) * 100;
            return (
              <motion.div
                key={it.category}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease, delay: i * 0.04 }}
                className="grid grid-cols-12 items-center gap-4 border-b border-hairline last:border-b-0 p-5"
              >
                <div className="col-span-5 text-sm text-carbon">
                  {it.category}
                </div>
                <div className="col-span-5">
                  <div className="h-1.5 bg-hairline/60 w-full">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 1, ease, delay: i * 0.04 + 0.15 }}
                      className="h-full bg-navy"
                    />
                  </div>
                </div>
                <div className="col-span-1 text-right text-xs text-carbon-muted num">
                  {pct.toFixed(1)}%
                </div>
                <div className="col-span-1 text-right font-serif text-navy num">
                  {formatCurrency(it.usd, { compact: true })}
                </div>
              </motion.div>
            );
          })}
          <div className="grid grid-cols-12 items-center gap-4 bg-navy/[0.03] p-5">
            <div className="col-span-5 eyebrow">Totale</div>
            <div className="col-span-5" />
            <div className="col-span-1 text-right text-xs text-carbon-muted num">
              100%
            </div>
            <div className="col-span-1 text-right font-serif text-navy num">
              {formatCurrency(totalInvestment, { compact: true })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* FEASIBILITY SCORE */}
      <AnimatedSection className="mt-28">
        <p className="eyebrow">Feasibility score</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Otto dimensioni valutate, sette in miglioramento.
        </h2>

        <div className="mt-12 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 border border-hairline p-8 bg-white">
            <p className="eyebrow">Score totale</p>
            <div className="mt-6 flex items-baseline gap-2 num">
              <span className="font-serif text-[96px] leading-none text-navy">
                {meta.feasibility_score}
              </span>
              <span className="font-serif text-3xl text-carbon-muted">
                /100
              </span>
            </div>
            <p className="mt-6 text-sm text-carbon-muted">
              Da{" "}
              <span className="num text-carbon">
                {meta.feasibility_score_baseline}
              </span>{" "}
              a{" "}
              <span className="num text-navy">
                {meta.feasibility_score}
              </span>
              {" "}dopo la ricalibrazione.
            </p>
            <div className="mt-6 h-px bg-hairline" />
            <p className="mt-6 text-xs text-carbon-muted leading-relaxed">
              Lo score è la media pesata delle 8 dimensioni operative del
              piano. Il delta riflette esclusivamente l'effetto delle 5 leve
              applicate.
            </p>
          </div>

          <div className="lg:col-span-8 border border-hairline overflow-hidden">
            <div className="grid grid-cols-12 border-b border-hairline bg-white">
              <div className="col-span-4 p-4 eyebrow">Dimensione</div>
              <div className="col-span-1 p-4 eyebrow text-right">Peso</div>
              <div className="col-span-2 p-4 eyebrow text-right">Base</div>
              <div className="col-span-2 p-4 eyebrow text-right">Ricalibr.</div>
              <div className="col-span-3 p-4 eyebrow">Nota</div>
            </div>
            {feasibility_dimensions.map((d, i) => {
              const delta = d.score_recalibrated - d.score_baseline;
              return (
                <motion.div
                  key={d.dimension}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="grid grid-cols-12 items-center border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors"
                >
                  <div className="col-span-4 p-4 text-sm text-navy font-serif">
                    {d.dimension}
                  </div>
                  <div className="col-span-1 p-4 text-right num text-xs text-carbon-muted">
                    {d.weight}%
                  </div>
                  <div className="col-span-2 p-4 text-right num text-carbon-muted">
                    {d.score_baseline}
                  </div>
                  <div className="col-span-2 p-4 text-right num text-navy">
                    {d.score_recalibrated}
                    {delta > 0 && (
                      <span className="ml-2 text-xs text-gold num">
                        +{delta}
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 p-4 text-xs text-carbon-muted leading-relaxed">
                    {d.comment}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

function HeroKpi({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="bg-white p-8">
      <p className="eyebrow">{label}</p>
      <p className="mt-4 font-serif text-4xl text-navy num">{value}</p>
      <p className="mt-4 text-xs text-carbon-muted leading-relaxed">
        {caption}
      </p>
    </div>
  );
}

function Legend({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "block w-6 border-t",
          dashed ? "border-dashed" : "border-solid"
        )}
        style={{ borderColor: color, borderTopWidth: 1.5 }}
      />
      <span className="text-xs text-carbon-muted tracking-tight">{label}</span>
    </div>
  );
}
