"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import model from "@/data/operating-model.json";
import { formatCurrency } from "@/lib/utils";

export default function ModelloOperativoPage() {
  const totalMonthly = model.costs.reduce((s, c) => s + c.monthly, 0);

  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">03 · Modello operativo</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          Una struttura lean costruita attorno al CEO in field, un sales rep
          e un 3PL integrato.
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          Il modello operativo massimizza tempo commerciale utile e
          minimizza overhead. Ogni giorno della settimana ha un blocco
          dedicato e misurabile.
        </p>
      </AnimatedSection>

      <AnimatedSection stagger className="mt-20">
        <p className="eyebrow">Settimana tipo</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-xl">
          Sei blocchi ripetibili.
        </h2>

        <div className="mt-10 grid md:grid-cols-3 lg:grid-cols-6 gap-px bg-hairline border border-hairline">
          {model.weeklyFlow.map((d, i) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.06,
              }}
              className="relative bg-white p-6 min-h-[220px] flex flex-col"
            >
              <p className="eyebrow text-carbon-muted">{d.day}</p>
              <p className="mt-4 font-serif text-lg text-navy">{d.block}</p>
              <p className="mt-auto pt-6 text-xs text-carbon-muted leading-relaxed">
                {d.detail}
              </p>
              <span className="absolute top-0 left-0 h-px w-0 bg-gold group-hover:w-full transition-all" />
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mt-24">
        <p className="eyebrow">Struttura</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Cinque ruoli, nessuna ridondanza.
        </h2>

        <div className="mt-10 border border-hairline">
          <div className="grid grid-cols-12 border-b border-hairline bg-white">
            <div className="col-span-3 p-4 eyebrow">Ruolo</div>
            <div className="col-span-2 p-4 eyebrow">Seniority</div>
            <div className="col-span-2 p-4 eyebrow">Status</div>
            <div className="col-span-5 p-4 eyebrow">Mandato</div>
          </div>
          {model.structure.map((s, i) => (
            <motion.div
              key={s.role}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="grid grid-cols-12 border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors"
            >
              <div className="col-span-3 p-4 text-navy font-serif">
                {s.role}
              </div>
              <div className="col-span-2 p-4 text-sm text-carbon">
                {s.seniority}
              </div>
              <div className="col-span-2 p-4 text-sm text-carbon-muted">
                {s.status}
              </div>
              <div className="col-span-5 p-4 text-sm text-carbon-muted leading-relaxed">
                {s.mandate}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection stagger className="mt-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Costi fissi mensili</p>
            <h2 className="mt-3 font-serif text-hero text-navy">
              {formatCurrency(totalMonthly)}
              <span className="text-carbon-muted text-2xl">/mese</span>
            </h2>
          </div>
          <p className="hidden md:block text-xs text-carbon-muted max-w-xs text-right">
            Allineato al target di $21k/mese previsto nel piano finanziario.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 lg:grid-cols-6 gap-px bg-hairline border border-hairline">
          {model.costs.map((c, i) => (
            <motion.div
              key={c.item}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.05,
              }}
              className="bg-white p-6"
            >
              <p className="eyebrow text-carbon-muted">{c.item}</p>
              <p className="mt-4 font-serif text-2xl text-navy num">
                {formatCurrency(c.monthly)}
              </p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
