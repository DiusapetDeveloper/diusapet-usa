"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";
import {
  ChevronDown,
  Dog,
  Home,
  Search,
  Store,
  Truck,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AnimatedSection } from "@/components/animated-section";
import clientsData from "@/data/clients.json";
import { cn } from "@/lib/utils";

const ProspectMap = dynamic(
  () => import("@/components/prospect-map").then((m) => m.ProspectMap),
  {
    ssr: false,
    loading: () => (
      <div className="relative min-h-[680px] border border-hairline bg-white flex items-center justify-center">
        <p className="eyebrow text-carbon-muted">Caricamento mappa…</p>
      </div>
    ),
  }
);

type Prospect = (typeof clientsData.prospects)[number];

const { meta, stats, prospects } = clientsData;

const TYPE_LABEL: Record<string, string> = {
  pet_store: "Pet store",
  italian_market: "Italian market",
  breeder: "Breeder",
  distributor: "Distributore",
  daycare: "Daycare",
};

const TYPE_ICON = {
  pet_store: Store,
  italian_market: UtensilsCrossed,
  breeder: Dog,
  distributor: Truck,
  daycare: Home,
} as const;

const TYPE_ORDER: Array<keyof typeof TYPE_ICON> = [
  "pet_store",
  "italian_market",
  "breeder",
  "distributor",
  "daycare",
];

const PRIORITY_ORDER = ["UNICUM", "HOT", "WARM"] as const;

function stateBucket(s: string): "NJ" | "NY" | "PA" | "other" {
  if (s === "NJ" || s === "NY" || s === "PA") return s;
  return "other";
}

const STATE_CHIP_LABELS: Array<{ key: string; label: string }> = [
  { key: "NJ", label: "NJ" },
  { key: "NY", label: "NY" },
  { key: "PA", label: "PA" },
  { key: "other", label: "Altri" },
];

const stateChipCounts: Record<string, number> = prospects.reduce(
  (acc, p) => {
    const b = stateBucket(p.state);
    acc[b] = (acc[b] ?? 0) + 1;
    return acc;
  },
  { NJ: 0, NY: 0, PA: 0, other: 0 } as Record<string, number>
);

const PAGE_SIZE = 25;

export default function ClientiPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 200);
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [priorities, setPriorities] = useState<Set<string>>(new Set());
  const [states, setStates] = useState<Set<string>>(new Set());

  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const filtersRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return prospects.filter((p) => {
      if (types.size > 0 && !types.has(p.type)) return false;
      if (priorities.size > 0 && !priorities.has(p.priority)) return false;
      if (states.size > 0 && !states.has(stateBucket(p.state))) return false;
      if (q) {
        const hay =
          p.name.toLowerCase() +
          " " +
          (p.city || "").toLowerCase() +
          " " +
          (p.owner || "").toLowerCase() +
          " " +
          (p.brands_sold || "").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [debounced, types, priorities, states]);

  useEffect(() => {
    setPage(0);
  }, [debounced, types, priorities, states]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(
    clampedPage * PAGE_SIZE,
    (clampedPage + 1) * PAGE_SIZE
  );

  const typeBreakdown = useMemo(() => {
    const out: Record<string, number> = {};
    TYPE_ORDER.forEach((t) => (out[t] = 0));
    filtered.forEach((p) => {
      if (out[p.type] !== undefined) out[p.type]++;
    });
    return out;
  }, [filtered]);

  const handleSelect = (id: string) => {
    const idx = filtered.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const target = Math.floor(idx / PAGE_SIZE);
    setPage(target);
    setHighlighted(id);
    window.setTimeout(() => {
      rowRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 60);
    window.setTimeout(() => setHighlighted(null), 2050);
  };

  const toggleSet =
    (setter: (v: Set<string>) => void, current: Set<string>) =>
    (value: string) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      setter(next);
    };

  const resetAll = () => {
    setSearch("");
    setTypes(new Set());
    setPriorities(new Set());
    setStates(new Set());
  };

  const hotUnicum =
    (stats.by_priority.HOT ?? 0) + (stats.by_priority.UNICUM ?? 0);
  const statesCovered = Object.keys(stats.by_state).length;

  const statChipCountsForMap = STATE_CHIP_LABELS.map((c) => ({
    ...c,
    count: stateChipCounts[c.key] ?? 0,
  }));

  return (
    <div className="container py-8">
      {/* HERO */}
      <AnimatedSection>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="eyebrow text-gold">
              Pipeline commerciale · CRM Cowork
            </p>
            <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
              {meta.total_prospects} contatti reali, tri-state area.
            </h1>
            <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
              Pipeline aggiornata dal CRM Cowork con dati verificati: pet
              store indipendenti, italian markets, allevatori e distributori.
              Ogni prospect ha un hook personalizzato e uno score di priorità.
            </p>
          </div>
          <p className="text-xs text-carbon-muted max-w-xs text-right num">
            {meta.subtitle}
          </p>
        </div>
      </AnimatedSection>

      {/* STATS BAND */}
      <AnimatedSection stagger className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <StatTile
          value={meta.total_prospects}
          label="Prospect totali"
          delay={0}
        />
        <StatTile
          value={statesCovered}
          label="Stati coperti"
          delay={0.1}
        />
        <StatTile
          value={hotUnicum}
          label="HOT + Unicum"
          delay={0.2}
        />
        <StatTile
          value={meta.goal_pre_container_orders}
          suffix=" ordini"
          label="Obiettivo pre-container"
          delay={0.3}
        />
      </AnimatedSection>

      {/* BREAKDOWN PER CATEGORIA */}
      <AnimatedSection stagger className="mt-24">
        <p className="eyebrow">Ripartizione per categoria</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Cinque segmenti, cinque narrative commerciali.
        </h2>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-px bg-hairline border border-hairline">
          {TYPE_ORDER.map((t, i) => {
            const Icon = TYPE_ICON[t];
            const count = stats.by_type[t as keyof typeof stats.by_type] ?? 0;
            return (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.06,
                }}
                className="bg-white p-8"
              >
                <Icon className="h-5 w-5 text-navy" strokeWidth={1.2} />
                <p className="mt-6 font-serif text-4xl text-navy num">
                  {count}
                </p>
                <p className="mt-3 eyebrow">{TYPE_LABEL[t]}</p>
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* MAP */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">La mappa della pipeline</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          Il tri-state area, nome per nome.
        </h2>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          Densità pesante su Hudson County (Jersey City, Hoboken) e Brooklyn
          (Bay Ridge): corridoio giornaliero del CEO. Ogni punto è un
          prospect reale; i gruppi ≥3 sono aggregati con il numero dentro.
          Clicca un marker per saltare alla scheda.
        </p>

        <div className="mt-10">
          <ProspectMap
            prospects={filtered}
            totalCount={meta.total_prospects}
            goalPreContainer={meta.goal_pre_container_orders}
            stateChips={statChipCountsForMap}
            activeStates={states}
            onToggleState={toggleSet(setStates, states)}
            onSelect={handleSelect}
          />
        </div>
      </AnimatedSection>

      {/* FILTERS + TABLE */}
      <section ref={filtersRef} className="mt-24 scroll-mt-28">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="eyebrow">Pipeline completa</p>
            <h2 className="mt-3 font-serif text-hero text-navy max-w-xl">
              Filtra, cerca, espandi: {meta.total_prospects} prospect in una
              sola vista.
            </h2>
          </div>
        </div>

        {/* STICKY FILTERS BAR */}
        <div className="sticky top-20 z-20 bg-white/90 backdrop-blur-md border-y border-hairline -mx-6 px-6 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-carbon-muted"
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca per nome, città, owner, brand distribuiti…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-hairline focus:border-navy focus:outline-none transition-colors placeholder:text-carbon-muted"
              />
            </div>
            <p className="text-xs text-carbon-muted num whitespace-nowrap">
              Mostrati{" "}
              <span className="text-navy font-serif">{filtered.length}</span> di{" "}
              {meta.total_prospects}
            </p>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 text-xs text-carbon-muted hover:text-navy border-b border-transparent hover:border-navy pb-0.5 transition-colors"
            >
              <X className="h-3 w-3" strokeWidth={1.8} />
              Reset
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterGroup
              label="Tipo"
              options={TYPE_ORDER.map((k) => ({
                key: k,
                label: TYPE_LABEL[k],
              }))}
              selected={types}
              onToggle={toggleSet(setTypes, types)}
              onClear={() => setTypes(new Set())}
            />
            <span className="h-4 w-px bg-hairline" />
            <FilterGroup
              label="Priorità"
              options={PRIORITY_ORDER.map((k) => ({
                key: k,
                label: k[0] + k.slice(1).toLowerCase(),
              }))}
              selected={priorities}
              onToggle={toggleSet(setPriorities, priorities)}
              onClear={() => setPriorities(new Set())}
            />
            <span className="h-4 w-px bg-hairline" />
            <FilterGroup
              label="Stato"
              options={STATE_CHIP_LABELS}
              selected={states}
              onToggle={toggleSet(setStates, states)}
              onClear={() => setStates(new Set())}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-6 border border-hairline overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 border-b border-hairline bg-white">
            <div className="col-span-1 p-4 eyebrow">#</div>
            <div className="col-span-3 p-4 eyebrow">Nome</div>
            <div className="col-span-1 p-4 eyebrow">Tipo</div>
            <div className="col-span-2 p-4 eyebrow">Luogo</div>
            <div className="col-span-1 p-4 eyebrow">Priorità</div>
            <div className="col-span-1 p-4 eyebrow">Stato</div>
            <div className="col-span-2 p-4 eyebrow">Hook</div>
            <div className="col-span-1 p-4" />
          </div>

          {paged.length === 0 ? (
            <div className="p-12 text-center">
              <p className="eyebrow text-carbon-muted">
                Nessun contatto corrisponde ai filtri
              </p>
            </div>
          ) : (
            paged.map((c, i) => {
              const isExpanded = expanded.has(c.id);
              const isHot = highlighted === c.id;
              const rowIdx = clampedPage * PAGE_SIZE + i + 1;
              return (
                <div
                  key={c.id}
                  ref={(el) => {
                    rowRefs.current[c.id] = el;
                  }}
                  className={cn(
                    "border-b border-hairline last:border-b-0 transition-colors duration-300",
                    isHot ? "bg-gold/10" : "bg-white"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setExpanded((prev) => {
                        const next = new Set(prev);
                        if (next.has(c.id)) next.delete(c.id);
                        else next.add(c.id);
                        return next;
                      });
                    }}
                    className={cn(
                      "w-full text-left grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-0 p-4 lg:p-0 transition-colors",
                      !isHot && "hover:bg-navy/[0.02]"
                    )}
                  >
                    <div className="lg:col-span-1 lg:p-4 font-mono text-[11px] text-carbon-muted num">
                      {String(rowIdx).padStart(3, "0")}
                    </div>
                    <div className="lg:col-span-3 lg:p-4">
                      <p className="font-serif text-navy text-base leading-tight flex items-center gap-1.5">
                        {c.italian_surname === "SÌ" && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                        )}
                        {c.name}
                      </p>
                      {c.owner && c.owner !== "—" && (
                        <p className="mt-0.5 text-xs text-carbon-muted truncate">
                          {c.owner}
                        </p>
                      )}
                    </div>
                    <div className="lg:col-span-1 lg:p-4">
                      <TypeBadge t={c.type} />
                    </div>
                    <div className="lg:col-span-2 lg:p-4 text-sm text-carbon">
                      {c.city}
                      {c.city && c.state ? ", " : ""}
                      <span className="text-carbon-muted">{c.state}</span>
                    </div>
                    <div className="lg:col-span-1 lg:p-4">
                      <PriorityBadge p={c.priority} />
                    </div>
                    <div className="lg:col-span-1 lg:p-4">
                      <StatusBadge s={c.status} />
                    </div>
                    <div className="lg:col-span-2 lg:p-4 text-xs text-carbon-muted leading-relaxed line-clamp-2">
                      {c.hook}
                    </div>
                    <div className="lg:col-span-1 lg:p-4 flex items-center justify-end">
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-carbon-muted transition-transform duration-300",
                          isExpanded && "rotate-180 text-navy"
                        )}
                        strokeWidth={1.5}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden bg-navy/[0.02]"
                      >
                        <ExpandedRow c={c} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* PAGINATION */}
        {filtered.length > PAGE_SIZE && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-carbon-muted num">
              {clampedPage * PAGE_SIZE + 1}–
              {Math.min((clampedPage + 1) * PAGE_SIZE, filtered.length)} di{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage(Math.max(0, clampedPage - 1))}
                disabled={clampedPage === 0}
                className={cn(
                  "text-xs uppercase tracking-micro border-b pb-0.5 transition-colors",
                  clampedPage === 0
                    ? "text-hairline border-transparent cursor-default"
                    : "text-carbon-muted border-transparent hover:text-navy hover:border-navy"
                )}
              >
                Precedente
              </button>
              <p className="text-xs text-carbon-muted num">
                <span className="text-navy font-serif text-sm">
                  {clampedPage + 1}
                </span>{" "}
                / {totalPages}
              </p>
              <button
                onClick={() =>
                  setPage(Math.min(totalPages - 1, clampedPage + 1))
                }
                disabled={clampedPage >= totalPages - 1}
                className={cn(
                  "text-xs uppercase tracking-micro border-b pb-0.5 transition-colors",
                  clampedPage >= totalPages - 1
                    ? "text-hairline border-transparent cursor-default"
                    : "text-carbon-muted border-transparent hover:text-navy hover:border-navy"
                )}
              >
                Successiva
              </button>
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="mt-24 -mx-6 border-y border-gold/40 bg-gold/[0.06]">
        <div className="container py-12 text-center">
          <p className="eyebrow text-gold">Obiettivo Settimana 1</p>
          <h3 className="mt-4 font-serif text-2xl md:text-3xl text-navy max-w-3xl mx-auto leading-snug">
            5 ordini firmati dai Top HOT.{" "}
            <span className="text-carbon-muted">
              Ogni contatto chiuso sposta il break-even di 2 settimane verso
              sinistra.
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}

/* -------------------- small components -------------------- */

function useDebounce<T>(value: T, delay: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return v;
}

function StatTile({
  value,
  label,
  suffix = "",
  delay = 0,
}: {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.35, triggerOnce: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      delay,
    });
    return () => controls.stop();
  }, [inView, value, mv, delay, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      <div className="flex items-baseline gap-1 num">
        <motion.span className="font-serif text-5xl text-navy leading-none">
          {rounded}
        </motion.span>
        {suffix && (
          <span className="text-carbon-muted text-sm">{suffix}</span>
        )}
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-micro text-carbon-muted">
        {label}
      </p>
    </motion.div>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: Array<{ key: string; label: string }>;
  selected: Set<string>;
  onToggle: (key: string) => void;
  onClear: () => void;
}) {
  const allActive = selected.size === 0;
  return (
    <div className="flex items-center gap-1.5">
      <span className="eyebrow text-carbon-muted mr-1">{label}</span>
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "px-2.5 py-1 text-[11px] uppercase tracking-micro border transition-colors",
          allActive
            ? "bg-navy text-white border-navy"
            : "text-carbon-muted border-hairline hover:border-navy hover:text-navy"
        )}
      >
        Tutti
      </button>
      {options.map((o) => {
        const active = selected.has(o.key);
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onToggle(o.key)}
            className={cn(
              "px-2.5 py-1 text-[11px] uppercase tracking-micro border transition-colors",
              active
                ? "bg-navy text-white border-navy"
                : "text-carbon-muted border-hairline hover:border-navy hover:text-navy"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function TypeBadge({ t }: { t: string }) {
  return (
    <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-micro border border-hairline text-carbon-muted">
      {TYPE_LABEL[t] ?? t}
    </span>
  );
}

function PriorityBadge({ p }: { p: string }) {
  const map: Record<string, string> = {
    UNICUM: "bg-gold text-white border-gold",
    HOT: "bg-navy text-white border-navy",
    WARM: "text-carbon-muted border-hairline",
    COLD: "text-carbon-muted/50 border-hairline",
  };
  return (
    <span
      className={cn(
        "inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-micro border",
        map[p] ?? map.WARM
      )}
    >
      {p}
    </span>
  );
}

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    lead: "text-carbon-muted border-hairline bg-hairline/40",
    contattato: "text-carbon-muted border-carbon/20",
    interessato: "text-navy border-navy",
    confermato: "text-white bg-navy border-navy",
  };
  return (
    <span
      className={cn(
        "inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-micro border",
        map[s] ?? map.lead
      )}
    >
      {s}
    </span>
  );
}

function ExpandedRow({ c }: { c: Prospect }) {
  const rows: Array<{ label: string; value?: string | null }> = [
    { label: "Telefono", value: nonEmpty(c.phone) },
    { label: "Email", value: nonEmpty(c.email) },
    { label: "Website", value: nonEmpty(c.website) },
    { label: "Brand distribuiti", value: nonEmpty(c.brands_sold) },
    { label: "Hook completo", value: nonEmpty(c.hook) },
    { label: "Prossimo step", value: nonEmpty(c.next_step) },
    { label: "Famiglia", value: nonEmpty(c.family_story) },
    {
      label: "Retailer serviti",
      value: nonEmpty(c.retailers_estimate),
    },
  ].filter((r) => r.value);

  return (
    <div className="px-6 py-6 grid md:grid-cols-2 gap-x-10 gap-y-4">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[140px_1fr] gap-4">
          <p className="eyebrow text-carbon-muted">{r.label}</p>
          <p className="text-xs text-carbon leading-relaxed">{r.value}</p>
        </div>
      ))}
    </div>
  );
}

function nonEmpty(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || s === "—" || s === "NON_TROVATO") return null;
  return s;
}
