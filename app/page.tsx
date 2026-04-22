"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { KPICard } from "@/components/kpi-card";
import { AnimatedSection } from "@/components/animated-section";
import kpisData from "@/data/kpis.json";

const WorldBridge = dynamic(() => import("@/components/world-bridge"), {
  ssr: false,
  loading: () => (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="min-h-[560px] flex items-center justify-center">
          <p className="eyebrow text-carbon-muted">Caricamento mappa…</p>
        </div>
      </div>
    </section>
  ),
});

const ease = [0.22, 1, 0.36, 1] as const;

const sections = [
  { href: "/mercato", label: "Mercato", hint: "$136B · +5.8% CAGR" },
  { href: "/prodotto", label: "Prodotto", hint: "8 SKU · margine 41–47%" },
  { href: "/modello-operativo", label: "Modello operativo", hint: "CEO + 1 sales + 3PL" },
  { href: "/piano-finanziario", label: "Piano finanziario", hint: "Break-even mese 20 · ROI 3Y +112%" },
  { href: "/clienti", label: "Clienti & pipeline", hint: "15 prospect HOT tri-state" },
  { href: "/roadmap", label: "Roadmap", hint: "90 giorni + 36 mesi" },
];

export default function Home() {
  return (
    <>
      <section className="container pt-8 md:pt-16 pb-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="eyebrow text-gold"
        >
          Executive cockpit · Riservato
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="mt-6 font-serif text-navy text-display max-w-5xl"
        >
          Ingresso strutturato di Diusapet nel mercato pet premium degli Stati
          Uniti.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg text-carbon-muted leading-relaxed"
        >
          Una lettura operativa del business case: dimensione di mercato,
          posizionamento di prodotto, modello lean, piano finanziario triennale
          e pipeline commerciale sul tri-state NJ/NY/CT.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/mercato"
            className="group inline-flex items-center gap-3 bg-navy text-white px-6 py-4 text-sm tracking-tight hover:bg-carbon transition-colors"
          >
            Esplora il business case
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/piano-finanziario"
            className="group inline-flex items-center gap-2 text-navy border-b border-navy/30 hover:border-gold pb-1 text-sm transition-colors"
          >
            Simula gli scenari
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </section>

      <section className="container relative pb-28">
        {/* Dot-grid pattern, scoped to this section only */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="kpi-dot-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="#0B1E3F" fillOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#kpi-dot-grid)" />
        </svg>

        <div className="relative">
          <div className="flex items-end justify-between mb-8 gap-6">
            <div>
              <p className="eyebrow">{kpisData.meta.title}</p>
              <h2 className="mt-3 font-serif text-hero text-navy max-w-xl">
                {kpisData.meta.subtitle}
              </h2>
            </div>
            <p className="hidden md:block text-xs text-carbon-muted max-w-xs text-right">
              {kpisData.meta.source}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpisData.kpis.map((k, i) => (
              <KPICard
                key={k.label}
                label={k.label}
                value={k.value}
                trend={k.trend}
                caption={k.caption}
                delay={i * 0.15}
              />
            ))}
          </div>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2, delay: 0.8, ease }}
            className="mt-10 h-px bg-gold origin-left"
          />
        </div>
      </section>

      <WorldBridge />

      <AnimatedSection stagger className="container pb-28">
        <p className="eyebrow">Indice operativo</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Naviga il dossier per dimensione decisionale.
        </h2>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
          {sections.map((s, i) => (
            <motion.div
              key={s.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease, delay: i * 0.05 }}
            >
              <Link
                href={s.href}
                className="group relative block p-8 bg-white hover:bg-navy/[0.02] transition-colors"
              >
                <p className="eyebrow text-carbon-muted">0{i + 1}</p>
                <h3 className="mt-4 font-serif text-2xl text-navy">
                  {s.label}
                </h3>
                <p className="mt-3 text-sm text-carbon-muted num">{s.hint}</p>
                <ArrowUpRight className="absolute top-8 right-8 h-4 w-4 text-carbon-muted transition-all group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}
