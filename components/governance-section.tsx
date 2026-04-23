"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  BookLock,
  Building2,
  Clock,
  Factory,
  MapPin,
  Store,
  TrendingUp,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import governance from "@/data/governance.json";
import { cn, formatCurrency } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ENTITY_ICON: Record<string, LucideIcon> = {
  Building2,
  Factory,
  Store,
};

const FLOW_ICON: Record<string, LucideIcon> = {
  BookLock,
  Truck,
  Wrench,
  TrendingUp,
};

// Map IT matrix values → message key
const MATRIX_BADGE_KEY: Record<string, string> = {
  Decide: "decide",
  Propone: "propone",
  Approva: "approva",
  Firma: "firma",
  Informato: "informato",
  Trattativa: "trattativa",
};

// Badge visual style per value
function badgeStyle(value: string): string {
  switch (value) {
    case "Decide":
      return "bg-gold text-white border-gold";
    case "Approva":
    case "Firma":
      return "bg-navy text-white border-navy";
    case "Propone":
    case "Trattativa":
      return "text-navy border-navy bg-white";
    case "Informato":
      return "text-carbon-muted border-hairline bg-hairline/40";
    default:
      return "";
  }
}

export default function GovernanceSection() {
  const t = useTranslations("governance");
  const {
    meta,
    headline_kpi,
    hierarchy,
    roles,
    decision_matrix,
    contractual_flows,
    why_this_structure,
    capital_structure,
    closing_callout,
  } = governance;

  return (
    <div className="container py-8">
      {/* 1 — HERO */}
      <section>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="eyebrow text-gold">{meta.eyebrow}</p>
            <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
              {meta.title}
            </h1>
            <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
              {meta.subtitle}
            </p>
          </div>
          <p className="text-xs text-carbon-muted max-w-xs text-right leading-relaxed">
            {meta.source}
          </p>
        </div>
      </section>

      {/* 2 — KPI STRIP */}
      <section className="mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline border border-hairline">
          {headline_kpi.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              className="bg-white p-6 md:p-8 flex flex-col"
            >
              <p className="eyebrow text-carbon-muted leading-snug">
                {k.label}
              </p>
              <div className="mt-4 flex items-baseline gap-1 num">
                <span className="font-serif text-3xl md:text-4xl text-navy leading-none">
                  {k.value}
                </span>
                {k.unit && (
                  <span className="font-serif text-base text-navy/70 ml-1">
                    {k.unit}
                  </span>
                )}
              </div>
              <div className="mt-4 h-px w-8 bg-gold" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3 — HIERARCHY DIAGRAM */}
      <section className="mt-28">
        <p className="eyebrow">{hierarchy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {hierarchy.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {hierarchy.subtitle}
        </p>

        <HierarchyDiagram levels={hierarchy.levels} />
      </section>

      {/* 4 — ROLES */}
      <section className="mt-28">
        <p className="eyebrow">{roles.eyebrow}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {roles.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {roles.subtitle}
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {roles.positions.map((p, i) => (
            <RoleCard key={p.id} position={p} index={i} />
          ))}
        </div>
      </section>

      {/* 5 — DECISION MATRIX */}
      <section className="mt-28">
        <p className="eyebrow">{decision_matrix.eyebrow}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {decision_matrix.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {decision_matrix.subtitle}
        </p>

        <DecisionMatrix rows={decision_matrix.matrix} />
      </section>

      {/* 6 — CONTRACTUAL FLOWS */}
      <section className="mt-28">
        <p className="eyebrow">{contractual_flows.eyebrow}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {contractual_flows.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {contractual_flows.subtitle}
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-px bg-hairline border border-hairline">
          {contractual_flows.flows.map((f, i) => (
            <FlowCard key={f.id} flow={f} index={i} />
          ))}
        </div>
      </section>

      {/* 7 — RATIONALE */}
      <section className="mt-28">
        <p className="eyebrow">{why_this_structure.eyebrow}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {why_this_structure.title}
        </h2>

        <ul className="mt-10 border-y border-hairline divide-y divide-hairline">
          {why_this_structure.reasons.map((r, i) => (
            <motion.li
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease, delay: i * 0.08 }}
              className="grid grid-cols-[80px_1fr] gap-6 items-baseline py-6"
            >
              <span className="font-serif text-4xl text-gold num leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="max-w-[640px]">
                <h3 className="font-serif text-navy text-xl leading-snug">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-carbon-muted leading-relaxed">
                  {r.text}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* 8 — CAPITAL STRUCTURE */}
      <section className="mt-28">
        <p className="eyebrow">{capital_structure.eyebrow}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {capital_structure.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {capital_structure.subtitle}
        </p>

        <CapitalBreakdown items={capital_structure.items} />

        <blockquote className="mt-8 border-l-2 border-gold pl-6 max-w-[720px]">
          <p className="font-serif italic text-base md:text-[17px] text-navy leading-relaxed">
            {capital_structure.visa_note}
          </p>
        </blockquote>
      </section>

      {/* 9 — CLOSING CALLOUT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease }}
        className="mt-24 mb-8 border-l-[3px] border-gold bg-gold/[0.05] px-8 md:px-12 py-12"
      >
        <p className="font-serif italic text-navy text-lg md:text-xl leading-relaxed max-w-[740px] mx-auto text-center">
          {closing_callout}
        </p>
      </motion.div>
    </div>
  );
}

/* ---------------- HIERARCHY DIAGRAM ---------------- */

type Level = (typeof governance.hierarchy.levels)[number];

function HierarchyDiagram({ levels }: { levels: Level[] }) {
  const reduce = useReducedMotion();
  const tH = useTranslations("governance.hierarchy");
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Struttura societaria: Diusa S.A. controlla al 100% Diusapet S.r.l., che controlla al 100% Diusapet USA LLC"
      className="mt-12 mx-auto max-w-[600px]"
    >
      {levels.map((level, i) => (
        <div key={level.id}>
          <EntityBox
            level={level}
            index={i}
            isLast={i === levels.length - 1}
            inView={inView}
            reduce={!!reduce}
            newEntityLabel={tH("newEntityBadge")}
          />
          {i < levels.length - 1 && (
            <ControlConnector
              label={tH("controlLabel")}
              inView={inView}
              reduce={!!reduce}
              delay={0.2 + i * 0.2 + 0.4}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function EntityBox({
  level,
  index,
  isLast,
  inView,
  reduce,
  newEntityLabel,
}: {
  level: Level;
  index: number;
  isLast: boolean;
  inView: boolean;
  reduce: boolean;
  newEntityLabel: string;
}) {
  const Icon = ENTITY_ICON[level.icon] ?? Building2;
  const textColor = level.color === "#B8925A" ? "#FFFFFF" : "#F5F3EE";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      animate={
        inView || reduce
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 30 }
      }
      transition={{
        duration: 0.6,
        ease,
        delay: reduce ? 0 : index * 0.2,
      }}
      className="relative p-8 min-h-[160px]"
      style={{
        backgroundColor: level.color,
        borderRadius: 2,
      }}
    >
      <Icon
        className="absolute top-6 right-6 h-6 w-6"
        strokeWidth={1.4}
        style={{ color: textColor, opacity: 0.75 }}
      />

      {isLast && (
        <span
          className="absolute top-6 left-6 inline-block px-2 py-1 text-[10px] uppercase tracking-micro bg-white"
          style={{ color: level.color }}
        >
          {newEntityLabel}
        </span>
      )}

      <div className={cn("flex flex-col justify-end h-full", isLast && "pt-8")}>
        <h3
          className="font-serif leading-tight"
          style={{ fontSize: 32, color: textColor }}
        >
          {level.name}
        </h3>
        <p
          className="mt-2 text-sm"
          style={{ color: textColor, opacity: 0.8 }}
        >
          {level.jurisdiction} · {level.role}
        </p>
        <p
          className="mt-3 text-xs leading-relaxed max-w-md"
          style={{ color: textColor, opacity: 0.65 }}
        >
          {level.function}
        </p>
      </div>
    </motion.div>
  );
}

function ControlConnector({
  label,
  inView,
  reduce,
  delay,
}: {
  label: string;
  inView: boolean;
  reduce: boolean;
  delay: number;
}) {
  return (
    <div className="relative h-20 flex items-center justify-center my-0">
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="#B8925A"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={
            inView || reduce
              ? { pathLength: 1 }
              : { pathLength: 0 }
          }
          transition={{
            duration: reduce ? 0 : 0.6,
            ease,
            delay: reduce ? 0 : delay,
          }}
        />
      </svg>
      <motion.span
        initial={reduce ? false : { opacity: 0 }}
        animate={inView || reduce ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.4,
          ease,
          delay: reduce ? 0 : delay + 0.6,
        }}
        className="relative z-10 bg-white px-3 py-1 text-[10px] uppercase tracking-micro text-gold border border-gold"
      >
        {label}
      </motion.span>
    </div>
  );
}

/* ---------------- ROLE CARD ---------------- */

type Position = (typeof governance.roles.positions)[number];

function RoleCard({ position, index }: { position: Position; index: number }) {
  const tR = useTranslations("governance.roles");
  const isCeo = position.id === "ceo";
  const accentColor = position.color;
  const isGoldAccent = accentColor === "#B8925A";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease, delay: index * 0.1 }}
      className="p-10 border-l-[3px]"
      style={{
        borderLeftColor: accentColor,
        backgroundColor: isGoldAccent
          ? "rgba(184, 146, 90, 0.04)"
          : "rgba(11, 30, 63, 0.04)",
      }}
    >
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <p
            className="font-serif leading-none"
            style={{ fontSize: 48, color: accentColor }}
          >
            {position.id.toUpperCase()}
          </p>
          <p className="mt-2 eyebrow text-carbon-muted">{position.title}</p>
          <p className="mt-3 font-serif text-xl text-navy">{position.holder}</p>
        </div>
        <span
          className={cn(
            "inline-block px-2 py-1 text-[10px] uppercase tracking-micro",
            isGoldAccent
              ? "bg-navy text-white border-navy"
              : "bg-gold text-white border-gold",
            "border"
          )}
        >
          {isCeo ? tR("groupExecPill") : tR("countryExecPill")}
        </span>
      </div>

      <div className="mt-6 h-px bg-hairline" />

      <div className="mt-6 space-y-3">
        <div className="flex items-start gap-3">
          <MapPin
            className="h-4 w-4 text-carbon-muted shrink-0 mt-0.5"
            strokeWidth={1.4}
          />
          <div className="text-[13px] leading-snug">
            <span className="eyebrow text-carbon-muted mr-2">
              {tR("basedLabel")}:
            </span>
            <span className="text-carbon">{position.based}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock
            className="h-4 w-4 text-carbon-muted shrink-0 mt-0.5"
            strokeWidth={1.4}
          />
          <div className="text-[13px] leading-snug">
            <span className="eyebrow text-carbon-muted mr-2">
              {tR("commitmentLabel")}:
            </span>
            <span className="text-carbon">{position.time_commitment}</span>
          </div>
        </div>
      </div>

      <p className="mt-6 eyebrow text-gold">{tR("scopeLabel")}</p>
      <p className="mt-2 text-sm text-carbon leading-relaxed">
        {position.scope}
      </p>

      <p className="mt-5 eyebrow text-gold">{tR("responsibilitiesLabel")}</p>
      <ul className="mt-2 space-y-1.5">
        {position.responsibilities.map((r, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[13px] text-carbon leading-snug"
          >
            <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-gold shrink-0" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

/* ---------------- DECISION MATRIX ---------------- */

type MatrixRow = (typeof governance.decision_matrix.matrix)[number];

function DecisionMatrix({ rows }: { rows: MatrixRow[] }) {
  const t = useTranslations("governance.decision");

  return (
    <>
      <div className="mt-10 border border-hairline overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-hairline bg-white">
              <Th className="w-[40%]">{t("headers.decision")}</Th>
              <Th className="w-[20%]">{t("headers.md")}</Th>
              <Th className="w-[20%]">{t("headers.ceo")}</Th>
              <Th className="w-[20%]">{t("headers.board")}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.decision}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, ease, delay: i * 0.03 }}
                className={cn(
                  "border-b border-hairline last:border-b-0",
                  i % 2 === 1 && "bg-[#F9F7F3]"
                )}
              >
                <Td>
                  <span className="font-serif text-navy text-[14px]">
                    {r.decision}
                  </span>
                </Td>
                <Td>
                  <MatrixBadge value={r.md} />
                </Td>
                <Td>
                  <MatrixBadge value={r.ceo} />
                </Td>
                <Td>
                  <MatrixBadge value={r.board} />
                </Td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="eyebrow text-carbon-muted">
          {t("legendLabel")}
        </p>
        {(["decide", "propone", "approva", "firma", "informato", "trattativa"] as const).map(
          (k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-micro border",
                  badgeStyleForKey(k)
                )}
              >
                {t(`badges.${k}`)}
              </span>
            </div>
          )
        )}
      </div>
    </>
  );
}

function badgeStyleForKey(key: string): string {
  switch (key) {
    case "decide":
      return "bg-gold text-white border-gold";
    case "approva":
    case "firma":
      return "bg-navy text-white border-navy";
    case "propone":
    case "trattativa":
      return "text-navy border-navy bg-white";
    case "informato":
      return "text-carbon-muted border-hairline bg-hairline/40";
    default:
      return "";
  }
}

function MatrixBadge({ value }: { value: string }) {
  const t = useTranslations("governance.decision.badges");
  if (value === "—" || !value) {
    return <span className="text-carbon-muted/60 text-center block">—</span>;
  }
  const key = MATRIX_BADGE_KEY[value];
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-[10px] uppercase tracking-micro border",
        badgeStyle(value)
      )}
    >
      {key ? t(key) : value}
    </span>
  );
}

/* ---------------- FLOW CARD ---------------- */

type Flow = (typeof governance.contractual_flows.flows)[number];

function FlowCard({ flow, index }: { flow: Flow; index: number }) {
  const tF = useTranslations("governance.flows");
  const Icon = FLOW_ICON[flow.icon] ?? BookLock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease, delay: index * 0.08 }}
      className="bg-white p-8 flex flex-col"
    >
      <Icon className="h-8 w-8 text-gold" strokeWidth={1.2} />

      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <span className="inline-block px-2 py-1 text-[10px] uppercase tracking-micro bg-navy/[0.04] text-navy border border-navy/20">
          {flow.from}
        </span>
        <ArrowRight className="h-4 w-4 text-gold" strokeWidth={1.5} />
        <span className="inline-block px-2 py-1 text-[10px] uppercase tracking-micro bg-navy/[0.04] text-navy border border-navy/20">
          {flow.to}
        </span>
      </div>

      <div className="mt-4">
        <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-micro bg-gold/10 text-gold border border-gold/40">
          {flow.type}
        </span>
      </div>

      <p className="mt-5 eyebrow">{tF("objectLabel")}</p>
      <p className="mt-2 text-sm text-carbon leading-relaxed">{flow.what}</p>

      <p className="mt-5 eyebrow">{tF("considerationLabel")}</p>
      <p className="mt-2 font-serif text-base text-navy">
        {flow.consideration}
      </p>

      <p className="mt-auto pt-5 text-[11px] italic text-carbon-muted leading-relaxed">
        {flow.note}
      </p>
    </motion.div>
  );
}

/* ---------------- CAPITAL BREAKDOWN ---------------- */

type CapItem = (typeof governance.capital_structure.items)[number];

function CapitalBreakdown({ items }: { items: CapItem[] }) {
  const tC = useTranslations("governance.capital");
  const rows = items.filter((x) => !x.is_total);
  const total =
    items.find((x) => x.is_total)?.amount ??
    rows.reduce((s, x) => s + x.amount, 0);

  return (
    <div className="mt-10 border border-hairline bg-white">
      {rows.map((row, i) => {
        const pct = (row.amount / total) * 100;
        const isEquity = i === 0;
        return (
          <motion.div
            key={row.component}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease, delay: i * 0.1 }}
            className="grid grid-cols-12 items-start gap-4 p-5 border-b border-hairline"
          >
            <div className="col-span-4 md:col-span-3">
              <p className="font-serif text-navy text-[15px]">
                {row.component}
              </p>
              <p className="mt-1 text-[11px] text-carbon-muted num">
                {pct.toFixed(0)}%
              </p>
            </div>
            <div className="col-span-5 md:col-span-7 pt-1.5">
              <div className="h-2 bg-hairline/60 w-full">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 1,
                    ease,
                    delay: 0.25 + i * 0.1,
                  }}
                  className="h-full"
                  style={{
                    backgroundColor: isEquity ? "#B8925A" : "#0B1E3F",
                  }}
                />
              </div>
              <p className="mt-2 text-[11px] text-carbon-muted leading-relaxed max-w-md">
                {row.note}
              </p>
            </div>
            <div className="col-span-3 md:col-span-2 text-right font-serif text-navy text-xl num">
              {formatCurrency(row.amount)}
            </div>
          </motion.div>
        );
      })}
      <div className="grid grid-cols-12 items-center gap-4 p-5 bg-gold/[0.08]">
        <div className="col-span-9 eyebrow text-gold">
          {tC("totalLabel")}
        </div>
        <div className="col-span-3 text-right font-serif text-navy text-2xl num">
          {formatCurrency(total)}
        </div>
      </div>
    </div>
  );
}

/* ---------------- table primitives ---------------- */

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("eyebrow text-left p-4 font-normal", className)}>
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("p-4 text-sm text-carbon align-top", className)}>
      {children}
    </td>
  );
}
