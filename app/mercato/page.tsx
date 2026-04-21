"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import market from "@/data/market.json";

export default function MercatoPage() {
  const growth = useInView({ threshold: 0.25, triggerOnce: true });
  const segments = useInView({ threshold: 0.25, triggerOnce: true });

  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">01 · Mercato</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          Un mercato da $136B, stabilmente in crescita, con un premio strutturale
          per il Made in Italy.
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          Negli ultimi sei anni il pet market USA è cresciuto del 40% in valore.
          La quota premium è oggi il 38% del totale, ma le importazioni italiane
          rappresentano meno del 2%: un gap sostanziale e servibile.
        </p>
      </AnimatedSection>

      <AnimatedSection stagger className="mt-20 grid md:grid-cols-4 gap-px bg-hairline border border-hairline">
        {[
          { k: "$136B", l: "Dimensione 2025" },
          { k: "+6.1%", l: "CAGR 2019–2025" },
          { k: "38%", l: "Quota premium" },
          { k: "<2%", l: "Import italiano" },
        ].map((s) => (
          <div key={s.l} className="bg-white p-8">
            <p className="font-serif text-4xl text-navy num">{s.k}</p>
            <p className="mt-3 eyebrow">{s.l}</p>
          </div>
        ))}
      </AnimatedSection>

      <section className="mt-24 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <p className="eyebrow">Crescita del mercato (US$ B)</p>
          <motion.div
            ref={growth.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={growth.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 h-[360px] border border-hairline bg-white p-6"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={market.growth}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0B1E3F" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0B1E3F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E6E8EC" vertical={false} />
                <XAxis
                  dataKey="year"
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
                  domain={[80, 160]}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #E6E8EC",
                    background: "white",
                    fontSize: 12,
                    borderRadius: 0,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0B1E3F"
                  strokeWidth={1.5}
                  fill="url(#g1)"
                  isAnimationActive={growth.inView}
                  animationDuration={1400}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow">Spesa per segmento (US$ B)</p>
          <motion.div
            ref={segments.ref}
            initial={{ opacity: 0, y: 30 }}
            animate={segments.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 h-[360px] border border-hairline bg-white p-6"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={market.segments} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid stroke="#E6E8EC" horizontal={false} />
                <XAxis type="number" stroke="#5B6470" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#5B6470"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #E6E8EC",
                    background: "white",
                    fontSize: 12,
                    borderRadius: 0,
                  }}
                  cursor={{ fill: "rgba(11,30,63,0.04)" }}
                />
                <Bar
                  dataKey="value"
                  fill="#0B1E3F"
                  isAnimationActive={segments.inView}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      <AnimatedSection stagger className="mt-24">
        <p className="eyebrow">Driver strutturali</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Quattro forze sostengono la tesi d'ingresso.
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-px bg-hairline border border-hairline">
          {market.drivers.map((d, i) => (
            <motion.article
              key={d.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className="bg-white p-10"
            >
              <p className="font-serif text-navy text-5xl num">0{i + 1}</p>
              <h3 className="mt-6 font-serif text-2xl text-navy">{d.title}</h3>
              <p className="mt-3 text-carbon-muted leading-relaxed">{d.detail}</p>
            </motion.article>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
