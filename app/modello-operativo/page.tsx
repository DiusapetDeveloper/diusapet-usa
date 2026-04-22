"use client";

import { motion } from "framer-motion";
import { KPICard } from "@/components/kpi-card";
import { AnimatedSection } from "@/components/animated-section";
import { WeeklyTimeline } from "@/components/weekly-timeline";
import ceoWeek from "@/data/ceo-week.json";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const {
  meta,
  weekly_kpi,
  categories,
  days,
  time_allocation,
  monthly_cadence,
} = ceoWeek;

const totalAllocHours = time_allocation.reduce(
  (s, a) => s + a.hours_per_week,
  0
);

export default function ModelloOperativoPage() {
  return (
    <div className="container py-8">
      {/* HERO */}
      <AnimatedSection>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="eyebrow text-gold">03 · Modello operativo</p>
            <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
              Un solo operatore, cinque giorni pieni, sessanta ore a
              settimana.
            </h1>
            <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
              {meta.subtitle}
            </p>
            <p className="mt-4 text-xs text-carbon-muted">
              Fonte: {meta.source}
            </p>
          </div>
          <span className="inline-block px-3 py-1.5 text-[11px] uppercase tracking-micro border border-navy text-navy whitespace-nowrap">
            {meta.phase}
          </span>
        </div>
      </AnimatedSection>

      {/* KPI BAND */}
      <section className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weekly_kpi.map((k, i) => (
            <KPICard
              key={k.label}
              label={k.label}
              value={k.value}
              delay={i * 0.15}
            />
          ))}
        </div>
      </section>

      {/* LEGENDA CATEGORIE */}
      <AnimatedSection className="mt-24">
        <div className="flex items-end justify-between gap-6 mb-6">
          <div>
            <p className="eyebrow">La settimana tipo</p>
            <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
              Sette giorni, sei tipologie di attività.
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-hairline py-4 mb-8">
          <p className="eyebrow text-carbon-muted">Categorie</p>
          {Object.entries(categories).map(([key, cat]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="inline-block"
                style={{
                  width: 12,
                  height: 3,
                  backgroundColor: cat.color,
                }}
              />
              <span className="text-xs text-carbon-muted">{cat.label}</span>
            </div>
          ))}
        </div>

        <WeeklyTimeline days={days} categories={categories} />
      </AnimatedSection>

      {/* TIME ALLOCATION */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">Distribuzione del tempo</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Il 40% della settimana è in furgone.
        </h2>
        <p className="mt-4 max-w-xl text-sm text-carbon-muted leading-relaxed">
          {totalAllocHours}h/settimana allocati per categoria operativa. Il
          riposo è escluso dalla barra perché non è tempo di lavoro
          produttivo.
        </p>

        <div className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
            className="flex h-14 w-full border border-hairline overflow-hidden"
          >
            {time_allocation.map((a, i) => {
              const cat = categories[a.category as keyof typeof categories];
              return (
                <motion.div
                  key={a.category}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${a.pct}%` }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 1,
                    ease,
                    delay: 0.2 + i * 0.08,
                  }}
                  className="flex items-center justify-center relative text-[11px] font-medium tracking-micro"
                  style={{
                    backgroundColor: cat?.color ?? "#E6E8EC",
                    color:
                      a.category === "rest" ? "#0B1E3F" : "#F5F3EE",
                    flexShrink: 0,
                  }}
                >
                  {a.pct >= 10 && <span>{a.pct}%</span>}
                </motion.div>
              );
            })}
          </motion.div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {time_allocation.map((a) => {
              const cat = categories[a.category as keyof typeof categories];
              return (
                <div key={a.category} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat?.color ?? "#E6E8EC" }}
                  />
                  <div>
                    <p className="text-xs text-navy">{cat?.label}</p>
                    <p className="text-[11px] text-carbon-muted num">
                      {a.hours_per_week}h/settimana · {a.pct}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* MONTHLY CADENCE */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">Cadenza mensile e annuale</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Oltre la settimana: la cornice ricorrente.
        </h2>

        <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
          {monthly_cadence.map((m, i) => {
            const cat = categories[m.category as keyof typeof categories];
            return (
              <motion.li
                key={`${m.frequency}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  ease,
                  delay: i * 0.05,
                }}
                className="grid grid-cols-[140px_1fr_auto] items-center gap-6 py-5"
              >
                <span className="eyebrow text-gold">{m.frequency}</span>
                <span className="font-serif text-[15px] text-navy leading-snug">
                  {m.activity}
                </span>
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: cat?.color ?? "#E6E8EC" }}
                  aria-label={cat?.label ?? m.category}
                />
              </motion.li>
            );
          })}
        </ul>
      </AnimatedSection>

      {/* CALLOUT FINALE */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease }}
        className="mt-24 -mx-6 border-y border-gold/40 bg-gold/[0.06]"
      >
        <div className="container py-12 text-center">
          <p className="eyebrow text-gold">Scalabilità del modello</p>
          <p className="mt-4 font-serif text-2xl md:text-3xl text-navy max-w-3xl mx-auto leading-snug">
            Questo modello regge fino a 800 sacchi/mese.{" "}
            <span className="text-carbon-muted">
              Oltre, si attiva Fase 2: un operatore part-time + driver
              dedicato.
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
