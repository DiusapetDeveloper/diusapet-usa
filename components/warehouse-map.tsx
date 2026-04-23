"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  Boxes,
  Briefcase,
  Package,
  Package2,
  Send,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import warehouse from "@/data/warehouse.json";
import { cn, formatCurrency } from "@/lib/utils";

const WAREHOUSE_KPI_KEYS = ["surface", "usage", "pallet", "bigbag"] as const;
const ZONE_KEY_MAP: Record<string, string> = {
  "loading-dock": "reception",
  "bigbag-storage": "bigbag",
  "bagging-area": "bagging",
  "shipping-staging": "staging",
  "finished-goods": "finished",
  "safety-equipment": "safety",
  office: "office",
};
const ARROW_KEY_MAP: Record<string, string> = {
  Ricezione: "reception",
  Prelievo: "picking",
  Stoccaggio: "storage",
  Picking: "pickingDispatch",
  "Carico furgone": "loading",
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ICON_MAP: Record<string, LucideIcon> = {
  Truck,
  Package,
  Package2,
  Send,
  Briefcase,
  Boxes,
  ShieldCheck,
};

const {
  meta,
  headline_kpi,
  svg: svgConf,
  zones,
  flow_arrows,
  space_allocation,
  equipment_breakdown,
  equipment_total_usd,
  scalability_note,
} = warehouse;

type Zone = (typeof zones)[number];

// Hardcoded path geometry to keep routing clean through corridors.
// Keys: "fromId->toId"
const ARROW_GEOMETRY: Record<
  string,
  { d: string; labelPos: [number, number] }
> = {
  "loading-dock->bigbag-storage": {
    d: "M 220 130 Q 230 108, 240 130",
    labelPos: [230, 98],
  },
  "bigbag-storage->bagging-area": {
    d: "M 520 130 Q 530 108, 540 130",
    labelPos: [530, 98],
  },
  "bagging-area->finished-goods": {
    d: "M 640 240 Q 560 290, 430 300",
    labelPos: [555, 285],
  },
  "finished-goods->shipping-staging": {
    d: "M 800 300 Q 830 270, 835 240",
    labelPos: [855, 278],
  },
  "shipping-staging->loading-dock": {
    d: "M 760 145 Q 480 350, 220 145",
    labelPos: [490, 264],
  },
};

const FLOW_LABELS = [
  { n: 1, l: "Ricezione" },
  { n: 2, l: "Bigbag" },
  { n: 3, l: "Imbustamento" },
  { n: 4, l: "Sacchi finiti" },
  { n: 5, l: "Spedizione" },
];

export function WarehouseMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const activeId = hovered ?? selected;
  const activeZone = zones.find((z) => z.id === activeId) ?? null;

  return (
    <div>
      {/* 1 — HEADER */}
      <Header />

      {/* 2 — KPI STRIP */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {headline_kpi.map((k, i) => (
          <KpiTile
            key={WAREHOUSE_KPI_KEYS[i]}
            kpiKey={WAREHOUSE_KPI_KEYS[i]}
            value={k.value}
            unit={k.unit}
            delay={i * 0.15}
          />
        ))}
      </div>

      {/* 3 — MAPPA SVG + 4 — PANNELLO */}
      <div className="mt-12 grid lg:grid-cols-[1fr_320px] gap-6">
        <MapCanvas
          activeId={activeId}
          onHover={setHovered}
          onSelect={(id) =>
            setSelected((cur) => (cur === id ? null : id))
          }
        />
        <DetailsPanel zone={activeZone} />
      </div>

      {/* 5 — LEGENDA FLOW */}
      <FlowLegend />

      {/* 6 — BREAKDOWN SPAZI */}
      <SpaceAllocation />

      {/* 7 — ATTREZZATURE & COSTI */}
      <EquipmentTable />

      {/* 8 — CALLOUT CAPACITÀ */}
      <CapacityCallout />
    </div>
  );
}

/* ---------------- HEADER ---------------- */

function Header() {
  const t = useTranslations("operativo.warehouse");
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap">
      <div>
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t("title")}
        </h2>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          {t("subtitle")}
        </p>
      </div>
      <div className="text-right text-xs text-carbon-muted space-y-0.5 num">
        <p className="text-navy">{t("locationLabel")}</p>
        <p>{t("rentLabel")}</p>
        <p>{t("portLabel")}</p>
      </div>
    </div>
  );
}

/* ---------------- KPI TILE (Italian-aware) ---------------- */

function KpiTile({
  value,
  unit,
  kpiKey,
  delay,
}: {
  value: string;
  unit: string;
  kpiKey: string;
  delay: number;
}) {
  const t = useTranslations("operativo.warehouse.kpi");
  const label = t(kpiKey);
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.35, triggerOnce: true });

  const cleaned = value.replace(/\./g, "");
  const isInteger = /^\d+$/.test(cleaned);
  const target = isInteger ? parseInt(cleaned, 10) : 0;
  const mv = useMotionValue(0);
  const formatter = new Intl.NumberFormat("it-IT");
  const display = useTransform(mv, (v) => formatter.format(Math.round(v)));

  useEffect(() => {
    if (!inView || !isInteger) return;
    if (reduce) {
      mv.set(target);
      return;
    }
    const controls = animate(mv, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      delay,
    });
    return () => controls.stop();
  }, [inView, target, mv, delay, isInteger, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease, delay }}
      className="relative flex flex-col justify-between h-full p-8 bg-white"
    >
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="#B8925A"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          initial={{ strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: inView ? 0 : 1 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay }}
        />
      </svg>

      <div className="relative z-10 eyebrow">{label}</div>

      <div className="relative z-10 mt-8 flex items-baseline gap-1 num">
        {isInteger ? (
          <motion.span className="font-serif text-5xl md:text-6xl text-navy leading-none">
            {display}
          </motion.span>
        ) : (
          <motion.span
            initial={{ opacity: 0, scale: 0.94 }}
            animate={
              inView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.94 }
            }
            transition={{ duration: 0.6, ease, delay: delay + 0.2 }}
            className="font-serif text-5xl md:text-6xl text-navy leading-none"
          >
            {value}
          </motion.span>
        )}
        {unit && (
          <span className="font-serif text-2xl md:text-3xl text-navy/75 ml-1">
            {unit}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-8 h-px w-8 bg-gold" />
    </motion.div>
  );
}

/* ---------------- MAP CANVAS ---------------- */

function MapCanvas({
  activeId,
  onHover,
  onSelect,
}: {
  activeId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const tFlow = useTranslations("operativo.warehouse.flow");
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div
      ref={ref}
      className="relative border border-hairline overflow-hidden"
      style={{ backgroundColor: svgConf.background_color }}
    >
      <div
        className="w-full"
        style={{ aspectRatio: "1000 / 520", minHeight: 280 }}
      >
        <svg
          viewBox={svgConf.viewBox}
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-label="Mappa del magazzino Linden"
        >
          <defs>
            <marker
              id="arrow-head"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#B8925A" />
            </marker>
          </defs>

          {/* Corridor fill (optional subtle gradient) */}
          <rect
            x={0}
            y={0}
            width={1000}
            height={520}
            fill={svgConf.background_color}
          />

          {/* Zones */}
          {zones.map((z, i) => (
            <ZoneRect
              key={z.id}
              zone={z}
              active={activeId === z.id}
              onHover={onHover}
              onSelect={onSelect}
              index={i}
              inView={inView}
              reduce={!!reduce}
            />
          ))}

          {/* Flow arrows */}
          {flow_arrows.map((a, i) => {
            const geom = ARROW_GEOMETRY[`${a.from}->${a.to}`];
            if (!geom) return null;
            const localizedLabel = tFlow(
              ARROW_KEY_MAP[a.label] ?? "reception"
            );
            return (
              <FlowArrow
                key={`${a.from}-${a.to}`}
                d={geom.d}
                labelPos={geom.labelPos}
                label={localizedLabel}
                index={i}
                inView={inView}
                reduce={!!reduce}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ---------------- ZONE RECT ---------------- */

function ZoneRect({
  zone,
  active,
  onHover,
  onSelect,
  index,
  inView,
  reduce,
}: {
  zone: Zone;
  active: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  index: number;
  inView: boolean;
  reduce: boolean;
}) {
  const t = useTranslations("operativo.warehouse.zones");
  const { x, y, w, h } = zone.svg;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const Icon = ICON_MAP[zone.icon] ?? Boxes;
  const localizedName = t(ZONE_KEY_MAP[zone.id] ?? "reception");

  return (
    <motion.g
      initial={reduce ? false : { opacity: 0 }}
      animate={
        inView || reduce
          ? { opacity: 1 }
          : { opacity: 0 }
      }
      transition={{
        duration: 0.5,
        ease,
        delay: reduce ? 0 : 0.1 + index * 0.06,
      }}
      onMouseEnter={() => onHover(zone.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(zone.id)}
      style={{ cursor: "pointer" }}
      aria-label={`${localizedName}, ${zone.dims_ft} ft, ${zone.function}`}
    >
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={zone.color}
        fillOpacity={active ? 0.22 : 0.1}
        stroke={zone.color}
        strokeOpacity={active ? 1 : 0.55}
        strokeWidth={1.5}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transformBox: "fill-box",
        }}
        animate={{
          scale: active ? 1.02 : 1,
        }}
        transition={{ duration: 0.25, ease }}
      />

      {/* Icon top-left */}
      <Icon
        x={x + 12}
        y={y + 12}
        width={20}
        height={20}
        stroke="#0B1E3F"
        strokeWidth={1.5}
        fill="none"
      />

      {/* Flow stage badge */}
      {zone.flow_stage != null && (
        <g>
          <circle
            cx={x + w - 18}
            cy={y + 18}
            r={10}
            fill="#B8925A"
          />
          <text
            x={x + w - 18}
            y={y + 22}
            textAnchor="middle"
            fill="white"
            fontSize={11}
            fontWeight={600}
            style={{
              fontFamily: "var(--font-plex-sans), sans-serif",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {zone.flow_stage}
          </text>
        </g>
      )}

      {/* Name + subtitle center */}
      <text
        x={cx}
        y={cy + 2}
        textAnchor="middle"
        fill="#0B1E3F"
        fontSize={15}
        style={{
          fontFamily: "var(--font-plex-serif), serif",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {localizedName}
      </text>
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fill="#5B6470"
        fontSize={10}
        style={{
          fontFamily: "var(--font-plex-sans), sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {zone.dims_ft} · {zone.area_sqft} sqft
      </text>
    </motion.g>
  );
}

/* ---------------- FLOW ARROW ---------------- */

function FlowArrow({
  d,
  labelPos,
  label,
  index,
  inView,
  reduce,
}: {
  d: string;
  labelPos: [number, number];
  label: string;
  index: number;
  inView: boolean;
  reduce: boolean;
}) {
  const labelWidth = label.length * 6 + 12;
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 0.4,
        ease,
        delay: reduce ? 0 : 0.8 + index * 0.35,
      }}
    >
      <path
        className={reduce ? undefined : "arrow-dashed"}
        d={d}
        fill="none"
        stroke="#B8925A"
        strokeWidth={1.5}
        strokeDasharray={reduce ? undefined : "6 4"}
        strokeLinecap="round"
        markerEnd="url(#arrow-head)"
      />
      <g>
        <rect
          x={labelPos[0] - labelWidth / 2}
          y={labelPos[1] - 9}
          width={labelWidth}
          height={14}
          fill="#F5F3EE"
          stroke="#B8925A"
          strokeOpacity={0.2}
          strokeWidth={0.5}
          rx={1}
        />
        <text
          x={labelPos[0]}
          y={labelPos[1] + 1}
          textAnchor="middle"
          fill="#0B1E3F"
          fontSize={9}
          style={{
            fontFamily: "var(--font-plex-sans), sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            userSelect: "none",
          }}
        >
          {label}
        </text>
      </g>
    </motion.g>
  );
}

/* ---------------- DETAILS PANEL ---------------- */

function DetailsPanel({ zone }: { zone: Zone | null }) {
  const tDetails = useTranslations("operativo.warehouse.details");
  const tZones = useTranslations("operativo.warehouse.zones");
  const zoneName = zone ? tZones(ZONE_KEY_MAP[zone.id] ?? "reception") : "";
  return (
    <div className="border border-hairline bg-white p-6 min-h-[280px] lg:w-[320px]">
      <AnimatePresence mode="wait">
        {zone ? (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
          >
            {zone.flow_stage != null && (
              <p className="eyebrow text-gold">
                {tDetails("step")} {zone.flow_stage}
              </p>
            )}
            <h3 className="mt-2 font-serif text-[22px] text-navy leading-tight">
              {zoneName}
            </h3>
            <p className="mt-1 text-xs text-carbon-muted num">
              {zone.dims_ft} ft · {zone.area_sqft} sqft
            </p>
            <div className="mt-5 h-px w-10 bg-gold" />

            <p className="mt-5 eyebrow">{tDetails("function")}</p>
            <p className="mt-2 text-sm text-carbon leading-relaxed">
              {zone.function}
            </p>

            <p className="mt-5 eyebrow">{tDetails("equipment")}</p>
            <ul className="mt-2 space-y-1.5">
              {zone.equipment.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px] text-carbon leading-snug"
                >
                  <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-gold shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center h-full min-h-[240px]"
          >
            <p className="eyebrow text-carbon-muted text-center max-w-[220px] leading-relaxed">
              {tDetails("hoverHint")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- FLOW LEGEND ---------------- */

function FlowLegend() {
  const t = useTranslations("operativo.warehouse.flowLegend");
  return (
    <div className="mt-10 flex items-center justify-center gap-3 md:gap-4 flex-wrap">
      {FLOW_LABELS.map((s, i) => (
        <div key={s.n} className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-navy text-white text-[11px] font-semibold flex items-center justify-center num">
              {s.n}
            </span>
            <span className="text-[10px] uppercase tracking-micro text-carbon-muted">
              {t(String(s.n))}
            </span>
          </div>
          {i < FLOW_LABELS.length - 1 && (
            <span className="h-px w-6 bg-gold mb-5" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- SPACE ALLOCATION ---------------- */

function SpaceAllocation() {
  const t = useTranslations("operativo.warehouse");
  const productive = space_allocation.productive_zones_sqft;
  const corridors = space_allocation.corridors_maneuver_sqft;
  const total = productive + corridors;
  const pctProd = Math.round((productive / total) * 100);
  const pctCorr = 100 - pctProd;

  return (
    <section className="mt-20">
      <p className="eyebrow">{t("spaceAllocation.eyebrow")}</p>
      <h3 className="mt-3 font-serif text-hero text-navy max-w-2xl">
        {t("allocation.title")}
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease }}
        className="mt-8 flex h-12 w-full border border-hairline overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pctProd}%` }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className="bg-gold flex items-center justify-center text-white text-xs font-medium tracking-micro uppercase"
        >
          {pctProd}%
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pctCorr}%` }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="bg-hairline/80 flex items-center justify-center text-carbon-muted text-xs font-medium tracking-micro uppercase"
        >
          {pctCorr}%
        </motion.div>
      </motion.div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-gold shrink-0" />
          <div>
            <p className="text-xs text-navy">
              {t("allocation.productive.label")}
            </p>
            <p className="text-[11px] text-carbon-muted">
              {t("allocation.productive.note")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-hairline shrink-0" />
          <div>
            <p className="text-xs text-navy">
              {t("allocation.corridor.label")}
            </p>
            <p className="text-[11px] text-carbon-muted">
              {t("allocation.corridor.note")}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[13px] text-carbon-muted leading-relaxed max-w-[640px]">
        {t("allocation.subtitle")}
      </p>
    </section>
  );
}

/* ---------------- EQUIPMENT TABLE ---------------- */

function EquipmentTable() {
  const t = useTranslations("operativo.warehouse.setup");
  return (
    <section className="mt-20">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h3 className="mt-3 font-serif text-hero text-navy max-w-2xl">
        {t("title")}
      </h3>

      <div className="mt-8 border-y border-hairline">
        <div className="hidden md:grid grid-cols-[180px_1fr_140px] gap-6 py-3 border-b border-hairline">
          <p className="eyebrow text-carbon-muted">{t("headers.category")}</p>
          <p className="eyebrow text-carbon-muted">{t("headers.includes")}</p>
          <p className="eyebrow text-carbon-muted text-right">{t("headers.cost")}</p>
        </div>
        {equipment_breakdown.map((row, i) => {
          const catKey = (row as { categoryKey?: string }).categoryKey;
          const incKey = (row as { includesKey?: string }).includesKey;
          return (
            <motion.div
              key={catKey ?? row.category}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.45,
                ease,
                delay: i * 0.06,
              }}
              className="grid grid-cols-1 md:grid-cols-[180px_1fr_140px] gap-2 md:gap-6 py-4 border-b border-hairline last:border-b-0"
            >
              <p className="font-serif text-navy text-[15px]">
                {catKey ? t(`categories.${catKey}`) : row.category}
              </p>
              <p className="text-sm text-carbon-muted leading-relaxed">
                {incKey ? t(`includes.${incKey}`) : row.items}
              </p>
              <p className="md:text-right font-serif text-navy num">
                {formatCurrency(row.cost_usd)}
              </p>
            </motion.div>
          );
        })}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.5,
            ease,
            delay: equipment_breakdown.length * 0.06 + 0.1,
          }}
          className="grid grid-cols-1 md:grid-cols-[180px_1fr_140px] gap-2 md:gap-6 py-5 bg-gold/[0.06]"
        >
          <p className="eyebrow text-gold">{t("totalLabel")}</p>
          <p />
          <p className="md:text-right font-serif text-gold text-xl num">
            {formatCurrency(equipment_total_usd)}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- CAPACITY CALLOUT ---------------- */

function CapacityCallout() {
  const tCap = useTranslations("operativo.warehouse.capacity");
  const tSetup = useTranslations("operativo.warehouse.setup");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease }}
      className="mt-16 border-l-4 border-gold bg-gold/[0.04] px-6 md:px-10 py-8"
    >
      <p className="eyebrow text-gold">{tCap("eyebrow")}</p>
      <p className="mt-3 font-serif text-lg md:text-xl text-navy leading-relaxed max-w-3xl">
        {tSetup("capacityNote")}
      </p>
      {scalability_note && (
        <p className="mt-3 text-xs text-carbon-muted max-w-2xl leading-relaxed">
          {scalability_note}
        </p>
      )}
    </motion.div>
  );
}
