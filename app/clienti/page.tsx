"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { PipelineFunnel } from "@/components/pipeline-funnel";
import clients from "@/data/clients.json";
import { cn } from "@/lib/utils";

const STAGES = ["lead", "contattato", "interessato", "confermato"] as const;

export default function ClientiPage() {
  const funnel = STAGES.map((s) => ({
    stage: s[0].toUpperCase() + s.slice(1),
    value: clients.filter((c) => c.status === s).length,
  }));

  // Invert so top stage = total (funnel visualization)
  const cumulative = [...funnel];
  cumulative[0].value = clients.length;
  cumulative[1].value = clients.filter(
    (c) => c.status !== "lead"
  ).length;
  cumulative[2].value = clients.filter(
    (c) => c.status === "interessato" || c.status === "confermato"
  ).length;
  cumulative[3].value = clients.filter((c) => c.status === "confermato").length;

  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">05 · Clienti</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          Pipeline tri-state: {clients.length} prospect qualificati, {cumulative[3].value} già confermati.
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          L'approccio commerciale combina pet store indipendenti, mercati
          italiani e allevatori specializzati. Segmenti diversi, pricing
          coerente, cross-sell ad alto potenziale.
        </p>
      </AnimatedSection>

      <section className="mt-20 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <PipelineFunnel data={cumulative} />
        </div>

        <AnimatedSection className="lg:col-span-2 border border-hairline bg-white p-6">
          <div className="flex items-baseline justify-between mb-4">
            <p className="eyebrow">Copertura territoriale</p>
            <p className="text-xs text-carbon-muted">NJ · NY</p>
          </div>
          <div className="relative h-[300px] border border-dashed border-hairline bg-navy/[0.02] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-6 w-6 text-navy" strokeWidth={1.2} />
              <p className="mt-3 eyebrow">Placeholder mappa NJ/NY</p>
              <p className="mt-2 text-xs text-carbon-muted max-w-xs mx-auto leading-relaxed">
                Integrazione prevista con Mapbox o Leaflet per pinpoint
                prospect e rotte settimanali del sales rep.
              </p>
            </div>
            <Pin top="20%" left="40%" />
            <Pin top="45%" left="55%" />
            <Pin top="62%" left="30%" />
            <Pin top="72%" left="68%" />
          </div>
        </AnimatedSection>
      </section>

      <AnimatedSection stagger className="mt-24">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="eyebrow">Top 15 prospect</p>
            <h2 className="mt-3 font-serif text-hero text-navy max-w-xl">
              Lo stato della pipeline, nome per nome.
            </h2>
          </div>
        </div>

        <div className="border border-hairline overflow-hidden">
          <div className="hidden md:grid grid-cols-12 border-b border-hairline bg-white">
            <div className="col-span-1 p-4 eyebrow">#</div>
            <div className="col-span-3 p-4 eyebrow">Cliente</div>
            <div className="col-span-2 p-4 eyebrow">Tipo</div>
            <div className="col-span-2 p-4 eyebrow">Città</div>
            <div className="col-span-1 p-4 eyebrow">Stato</div>
            <div className="col-span-3 p-4 eyebrow">Hook</div>
          </div>
          {clients.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors p-4 md:p-0"
            >
              <div className="md:col-span-1 md:p-4 text-carbon-muted num text-sm">
                {String(c.id).padStart(2, "0")}
              </div>
              <div className="md:col-span-3 md:p-4 font-serif text-navy">
                {c.name}
              </div>
              <div className="md:col-span-2 md:p-4 text-xs text-carbon-muted">
                {labelType(c.type)}
              </div>
              <div className="md:col-span-2 md:p-4 text-sm text-carbon">
                {c.city}, {c.state}
              </div>
              <div className="md:col-span-1 md:p-4">
                <StatusBadge status={c.status} />
              </div>
              <div className="md:col-span-3 md:p-4 text-xs text-carbon-muted leading-relaxed">
                {c.hook}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}

function labelType(t: string) {
  if (t === "pet_store") return "Pet store";
  if (t === "italian_market") return "Italian market";
  if (t === "breeder") return "Breeder";
  return t;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    lead: "text-carbon-muted border-hairline",
    contattato: "text-navy border-navy/20",
    interessato: "text-navy border-navy/40 bg-navy/5",
    confermato: "text-white bg-navy border-navy",
  };
  return (
    <span
      className={cn(
        "inline-block px-2 py-1 text-[10px] uppercase tracking-micro border",
        map[status]
      )}
    >
      {status}
    </span>
  );
}

function Pin({ top, left }: { top: string; left: string }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.4 }}
      style={{ top, left }}
      className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold ring-4 ring-gold/20"
    />
  );
}
