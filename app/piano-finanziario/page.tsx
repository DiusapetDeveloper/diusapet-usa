"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import { ScenarioSimulator } from "@/components/scenario-simulator";
import financials from "@/data/financials.json";
import { formatCurrency } from "@/lib/utils";

export default function PianoFinanziarioPage() {
  const chart = useInView({ threshold: 0.25, triggerOnce: true });

  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">04 · Piano finanziario</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          Break-even al mese 20, ROI 3Y +112%, cassa gestita con un
          investimento iniziale di $185k.
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          Tre scenari simulabili e due leve di stress test. Il modello si
          aggiorna in tempo reale e riallinea ricavi, margine e break-even.
        </p>
      </AnimatedSection>

      <AnimatedSection stagger className="mt-20 grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
        <div className="bg-white p-8">
          <p className="eyebrow">Investimento iniziale</p>
          <p className="mt-4 font-serif text-4xl text-navy num">
            {formatCurrency(financials.initialInvestment)}
          </p>
          <p className="mt-3 text-xs text-carbon-muted">
            Copre setup legale, primo inventory, cauzione 3PL, branding e 6
            mesi di cassa operativa.
          </p>
        </div>
        <div className="bg-white p-8">
          <p className="eyebrow">Costi fissi mensili</p>
          <p className="mt-4 font-serif text-4xl text-navy num">
            {formatCurrency(financials.monthlyFixedCosts)}
          </p>
          <p className="mt-3 text-xs text-carbon-muted">
            Team, 3PL, trade marketing, G&A. Scalabile solo con ricavi
            verificati.
          </p>
        </div>
        <div className="bg-white p-8">
          <p className="eyebrow">Break-even scenario base</p>
          <p className="mt-4 font-serif text-4xl text-navy num">Mese 20</p>
          <p className="mt-3 text-xs text-carbon-muted">
            ROI triennale +112% con margine blended 44%.
          </p>
        </div>
      </AnimatedSection>

      <section className="mt-24">
        <p className="eyebrow">Simulatore scenari</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Pessimistico, base, ottimistico — e due leve di what-if.
        </h2>
        <div className="mt-10">
          <ScenarioSimulator />
        </div>
      </section>

      <section className="mt-24">
        <p className="eyebrow">P&L trimestrale (Y1–Y2)</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          La convergenza verso l'EBITDA positivo.
        </h2>

        <motion.div
          ref={chart.ref}
          initial={{ opacity: 0, y: 30 }}
          animate={chart.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 h-[420px] border border-hairline bg-white p-6"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={financials.plQuarterly}>
              <CartesianGrid stroke="#E6E8EC" vertical={false} />
              <XAxis
                dataKey="q"
                stroke="#5B6470"
                tickLine={false}
                axisLine={false}
                fontSize={11}
              />
              <YAxis
                stroke="#5B6470"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                formatter={(v: number) => formatCurrency(v, { compact: true })}
                contentStyle={{
                  border: "1px solid #E6E8EC",
                  background: "white",
                  fontSize: 12,
                  borderRadius: 0,
                }}
              />
              <ReferenceLine y={0} stroke="#B8925A" strokeDasharray="2 4" />
              <Bar
                dataKey="revenue"
                fill="#0B1E3F"
                isAnimationActive={chart.inView}
                animationDuration={1200}
              />
              <Line
                type="monotone"
                dataKey="ebitda"
                stroke="#B8925A"
                strokeWidth={1.8}
                dot={{ r: 3, fill: "#B8925A" }}
                isAnimationActive={chart.inView}
                animationDuration={1400}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </section>
    </div>
  );
}
