"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatedSection } from "@/components/animated-section";
import { PipelineFunnel } from "@/components/pipeline-funnel";
import clientsData from "@/data/clients.json";
import { cn } from "@/lib/utils";

const ProspectMap = dynamic(
  () => import("@/components/prospect-map").then((m) => m.ProspectMap),
  {
    ssr: false,
    loading: () => (
      <div className="relative min-h-[560px] border border-hairline bg-white flex items-center justify-center">
        <p className="eyebrow text-carbon-muted">Caricamento mappa…</p>
      </div>
    ),
  }
);

const { meta, funnel, prospects } = clientsData;

const FUNNEL_ORDER: Array<keyof typeof funnel> = [
  "lead",
  "contattato",
  "interessato",
  "confermato",
];

const funnelData = FUNNEL_ORDER.map((k) => ({
  stage: k[0].toUpperCase() + k.slice(1),
  value: funnel[k],
}));

const totalProspects = FUNNEL_ORDER.reduce((s, k) => s + funnel[k], 0);

export default function ClientiPage() {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleSelect = (rank: number) => {
    setHighlighted(rank);
    const row = rowRefs.current[rank];
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.setTimeout(() => setHighlighted(null), 2000);
  };

  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">05 · Clienti</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          {meta.title}
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          {meta.subtitle}
        </p>
        <p className="mt-4 text-xs text-carbon-muted num">
          Fonte: {meta.source} · Obiettivo pre-container:{" "}
          {meta.goal_pre_container_orders} ordini firmati
        </p>
      </AnimatedSection>

      <AnimatedSection
        stagger
        className="mt-16 grid md:grid-cols-4 gap-px bg-hairline border border-hairline"
      >
        <Kpi
          k={totalProspects.toString()}
          l="Prospect in pipeline"
          d="Short-list settimana 1, tutti priority HOT."
        />
        <Kpi
          k={funnel.confermato.toString()}
          l="Confermati"
          d="Interesse forte, richiesta samples o primo ordine in prep."
        />
        <Kpi
          k={funnel.interessato.toString()}
          l="Interessati"
          d="Riscontro positivo, in attesa di follow-up."
        />
        <Kpi
          k={meta.goal_pre_container_orders.toString()}
          l="Target pre-container"
          d="Soglia ordini firmati per validare primo shipment."
        />
      </AnimatedSection>

      <section className="mt-20">
        <PipelineFunnel data={funnelData} />
      </section>

      {/* MAPPA DELLA PIPELINE */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">La mappa della pipeline</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          Il tri-state area, nome per nome.
        </h2>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          Densità pesante su Hudson County (Jersey City, Hoboken) e Brooklyn
          (Bay Ridge): sono le zone in cui il CEO può fare field walking
          quotidiano. Montclair, Livingston e Short Hills completano l'arco
          Essex County. Clicca un marker per saltare alla scheda del
          prospect.
        </p>

        <div className="mt-10">
          <ProspectMap onSelect={handleSelect} />
        </div>
      </AnimatedSection>

      {/* TABELLA TOP 15 */}
      <div ref={tableRef} className="scroll-mt-28">
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
          <div className="hidden lg:grid grid-cols-12 border-b border-hairline bg-white">
            <div className="col-span-1 p-4 eyebrow">#</div>
            <div className="col-span-3 p-4 eyebrow">Cliente</div>
            <div className="col-span-2 p-4 eyebrow">Tipo</div>
            <div className="col-span-2 p-4 eyebrow">Località</div>
            <div className="col-span-1 p-4 eyebrow">Stato</div>
            <div className="col-span-3 p-4 eyebrow">Hook</div>
          </div>
          {prospects.map((c, i) => {
            const isHighlighted = highlighted === c.rank;
            return (
              <motion.div
                key={c.rank}
                ref={(el) => {
                  rowRefs.current[c.rank] = el;
                }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-0 border-b border-hairline last:border-b-0 transition-colors duration-300 p-4 lg:p-0",
                  isHighlighted
                    ? "bg-gold/10"
                    : "bg-white hover:bg-navy/[0.02]"
                )}
              >
                <div className="lg:col-span-1 lg:p-4 text-carbon-muted num text-sm">
                  {String(c.rank).padStart(2, "0")}
                </div>
                <div className="lg:col-span-3 lg:p-4">
                  <p className="font-serif text-navy text-lg leading-tight">
                    {c.name}
                  </p>
                  <p className="mt-1 text-xs text-carbon-muted">
                    {c.owner !== "—" ? `${c.owner} · ` : ""}
                    <span className="num">{c.phone}</span>
                  </p>
                </div>
                <div className="lg:col-span-2 lg:p-4 text-xs text-carbon-muted">
                  {labelType(c.type)}
                </div>
                <div className="lg:col-span-2 lg:p-4 text-sm text-carbon">
                  {c.city}
                  <span className="text-carbon-muted">, {c.state}</span>
                </div>
                <div className="lg:col-span-1 lg:p-4">
                  <StatusBadge status={c.status} />
                </div>
                <div className="lg:col-span-3 lg:p-4 text-xs text-carbon-muted leading-relaxed">
                  {c.hook}
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>
      </div>
    </div>
  );
}

function labelType(t: string) {
  if (t === "pet_store") return "Pet store";
  if (t === "pet_store_chain") return "Pet store chain";
  if (t === "italian_market") return "Italian market";
  if (t === "breeder") return "Breeder";
  return t;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    lead: "text-carbon-muted border-hairline bg-hairline/40",
    contattato: "text-carbon-muted border-carbon/20",
    interessato: "text-navy border-navy",
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

function Kpi({ k, l, d }: { k: string; l: string; d: string }) {
  return (
    <div className="bg-white p-8">
      <p className="font-serif text-4xl text-navy num">{k}</p>
      <p className="mt-3 eyebrow">{l}</p>
      <p className="mt-2 text-xs text-carbon-muted leading-relaxed">{d}</p>
    </div>
  );
}
