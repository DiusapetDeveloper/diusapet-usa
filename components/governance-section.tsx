"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  BookLock,
  Clock,
  DollarSign,
  FileText,
  Landmark,
  MapPin,
  ShoppingCart,
  TrendingUp,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import governance from "@/data/governance.json";
import { cn, formatCurrency } from "@/lib/utils";
import { HierarchyDiagram } from "@/components/hierarchy-diagram";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CONTRACT_ICON: Record<string, LucideIcon> = {
  BookLock,
  Truck,
  Wrench,
  TrendingUp,
  Landmark,
};

const CYCLE_ICON: Record<string, LucideIcon> = {
  ShoppingCart,
  FileText,
  DollarSign,
  TrendingUp,
};

// Extract final segment from a translation key path (e.g.
// "governance.decisionMatrix.values.decide" → "decide") so that the
// matrix badge style can be picked from the key itself rather than
// from the resolved (localized) label text.
function tailKey(path: string): string {
  const parts = path.split(".");
  return parts[parts.length - 1] ?? path;
}

function badgeStyleForKind(kind: string): string {
  switch (kind) {
    case "decide":
      return "bg-gold text-white border-gold";
    case "approve":
    case "sign":
      return "bg-navy text-white border-navy";
    case "propose":
    case "negotiate":
      return "text-navy border-navy bg-white";
    case "informed":
      return "text-carbon-muted border-hairline bg-hairline/40";
    default:
      return "";
  }
}

export default function GovernanceSection() {
  const t = useTranslations();
  const tUi = useTranslations("governance.ui");
  const {
    meta,
    headline_kpi,
    hierarchy,
    flows_animation,
    dividend_flow,
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
            <p className="eyebrow text-gold">{t(meta.eyebrowKey)}</p>
            <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
              {t(meta.titleKey)}
            </h1>
            <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
              {t(meta.subtitleKey)}
            </p>
          </div>
          <p className="text-xs text-carbon-muted max-w-xs text-right leading-relaxed">
            {t(meta.sourceKey)}
          </p>
        </div>
      </section>

      {/* 2 — KPI STRIP */}
      <section className="mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline border border-hairline">
          {headline_kpi.map((k, i) => (
            <motion.div
              key={k.labelKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              className="bg-white p-6 md:p-8 flex flex-col"
            >
              <p className="eyebrow text-carbon-muted leading-snug">
                {t(k.labelKey)}
              </p>
              <div className="mt-4 flex items-baseline gap-1 num">
                <span className="font-serif text-3xl md:text-4xl text-navy leading-none">
                  {k.value}
                </span>
                {k.unitKey && (
                  <span className="font-serif text-base text-navy/70 ml-1">
                    {t(k.unitKey)}
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
        <p className="eyebrow">{t(hierarchy.eyebrowKey)}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t(hierarchy.titleKey)}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t(hierarchy.subtitleKey)}
        </p>

        <div className="mt-12">
          <HierarchyDiagram />
        </div>
      </section>

      {/* 4 — FLOWS EXPLANATION */}
      <section className="mt-28">
        <p className="eyebrow">{t(flows_animation.eyebrowKey)}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t(flows_animation.titleKey)}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t(flows_animation.subtitleKey)}
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
          {flows_animation.cycle_steps.map((s, i) => {
            const Icon = CYCLE_ICON[s.icon] ?? TrendingUp;
            return (
              <motion.article
                key={s.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                className="bg-white p-7 flex flex-col border-l-[3px]"
                style={{ borderLeftColor: s.color }}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-serif text-4xl num leading-none"
                    style={{ color: s.color }}
                  >
                    {String(s.step).padStart(2, "0")}
                  </span>
                  <Icon
                    className="h-6 w-6"
                    strokeWidth={1.4}
                    style={{ color: s.color }}
                  />
                </div>
                <h3 className="mt-6 font-serif text-navy text-lg leading-snug">
                  {t(s.labelKey)}
                </h3>
                <p className="mt-3 text-sm text-carbon leading-relaxed">
                  {t(s.descKey)}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* 5 — DIVIDEND FLOW */}
      <section className="mt-28">
        <p className="eyebrow">{t(dividend_flow.eyebrowKey)}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t(dividend_flow.titleKey)}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t(dividend_flow.subtitleKey)}
        </p>

        <DividendTimeline
          phases={dividend_flow.phases}
          taxNoteKey={dividend_flow.taxNoteKey}
          whyBulgariaKey={dividend_flow.whyBulgariaKey}
        />
      </section>

      {/* 6 — ROLES */}
      <section className="mt-28">
        <p className="eyebrow">{t(roles.eyebrowKey)}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t(roles.titleKey)}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t(roles.subtitleKey)}
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {roles.positions.map((p, i) => (
            <RoleCard key={p.id} position={p} index={i} />
          ))}
        </div>
      </section>

      {/* 7 — DECISION MATRIX */}
      <section className="mt-28">
        <p className="eyebrow">{t(decision_matrix.eyebrowKey)}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t(decision_matrix.titleKey)}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t(decision_matrix.subtitleKey)}
        </p>

        <DecisionMatrix
          rows={decision_matrix.matrix}
          legendKeys={decision_matrix.legendKeys}
        />
      </section>

      {/* 8 — CONTRACTUAL FLOWS */}
      <section className="mt-28">
        <p className="eyebrow">{t(contractual_flows.eyebrowKey)}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t(contractual_flows.titleKey)}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t(contractual_flows.subtitleKey)}
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
          {contractual_flows.flows.map((f, i) => (
            <FlowCard key={f.id} flow={f} index={i} />
          ))}
        </div>
      </section>

      {/* 9 — RATIONALE */}
      <section className="mt-28">
        <p className="eyebrow">{t(why_this_structure.eyebrowKey)}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t(why_this_structure.titleKey)}
        </h2>

        <ul className="mt-10 border-y border-hairline divide-y divide-hairline">
          {why_this_structure.reasons.map((r, i) => (
            <motion.li
              key={r.titleKey}
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
                  {t(r.titleKey)}
                </h3>
                <p className="mt-2 text-sm text-carbon-muted leading-relaxed">
                  {t(r.textKey)}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* 10 — CAPITAL STRUCTURE */}
      <section className="mt-28">
        <p className="eyebrow">{t(capital_structure.eyebrowKey)}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t(capital_structure.titleKey)}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t(capital_structure.subtitleKey)}
        </p>

        {/* Injector card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease }}
          className="mt-10 border border-hairline bg-white p-6 md:p-8 flex items-start gap-5"
        >
          <span className="shrink-0 inline-flex items-center justify-center h-11 w-11 bg-navy/[0.06] text-navy">
            <Landmark className="h-5 w-5" strokeWidth={1.4} />
          </span>
          <div>
            <p className="eyebrow text-carbon-muted">
              {t(capital_structure.injectorLabelKey)}
            </p>
            <p className="mt-2 font-serif text-navy text-2xl leading-tight">
              {capital_structure.injector.name}
            </p>
            <p className="mt-1 text-[13px] text-carbon-muted">
              {t(capital_structure.injector.jurisdictionKey)} ·{" "}
              {t(capital_structure.injector.roleKey)}
            </p>
          </div>
        </motion.div>

        <CapitalBreakdown items={capital_structure.items} />

        <blockquote className="mt-8 border-l-2 border-gold pl-6 max-w-[720px]">
          <p className="font-serif italic text-base md:text-[17px] text-navy leading-relaxed">
            {t(capital_structure.visaNoteKey)}
          </p>
        </blockquote>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease }}
          className="mt-8 border-l-[3px] border-navy bg-navy/[0.04] px-6 py-5 max-w-[820px]"
        >
          <p className="eyebrow text-navy">
            {t(capital_structure.separationNoteTitleKey)}
          </p>
          <p className="mt-3 text-sm text-carbon leading-relaxed">
            {t(capital_structure.separationNoteKey)}
          </p>
        </motion.div>
      </section>

      {/* 11 — CLOSING CALLOUT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease }}
        className="mt-24 mb-8 border-l-[3px] border-gold bg-gold/[0.05] px-8 md:px-12 py-12"
      >
        <p className="font-serif italic text-navy text-lg md:text-xl leading-relaxed max-w-[740px] mx-auto text-center">
          {t(closing_callout.textKey)}
        </p>
      </motion.div>
    </div>
  );
}

/* ---------------- DIVIDEND TIMELINE ---------------- */

type DividendPhase = (typeof governance.dividend_flow.phases)[number];

function DividendTimeline({
  phases,
  taxNoteKey,
  whyBulgariaKey,
}: {
  phases: DividendPhase[];
  taxNoteKey: string;
  whyBulgariaKey: string;
}) {
  const t = useTranslations();
  const tUi = useTranslations("governance.ui");
  const widths = ["60%", "40%"];
  const colors = ["rgba(184, 146, 90, 0.12)", "rgba(91, 100, 112, 0.10)"];
  const borderColors = ["#B8925A", "#5B6470"];

  return (
    <>
      <div className="mt-12 border border-hairline bg-white">
        <div className="flex flex-col md:flex-row w-full">
          {phases.map((p, i) => (
            <motion.div
              key={p.phaseKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease, delay: i * 0.15 }}
              className={cn(
                "p-8 md:p-10 border-t md:border-t-0 border-hairline first:border-t-0",
                i === 0 ? "md:border-r md:border-hairline" : ""
              )}
              style={{
                width: "100%",
                flexBasis: widths[i],
                backgroundColor: colors[i],
                borderLeft: `3px solid ${borderColors[i]}`,
              }}
            >
              <p className="eyebrow" style={{ color: borderColors[i] }}>
                {t(p.phaseKey)}
              </p>
              <h3
                className="mt-4 font-serif text-2xl leading-snug"
                style={{ color: borderColors[i] }}
              >
                {t(p.policyKey)}
              </h3>
              <div className="mt-4 h-px w-10 bg-hairline" />
              <p className="mt-4 text-sm text-carbon leading-relaxed max-w-md">
                {t(p.noteKey)}
              </p>
              <p className="mt-6 eyebrow text-carbon-muted">
                {tUi("dividendLabel")}
              </p>
              <p className="mt-1 font-serif text-navy text-xl num">
                {i === 0 ? formatCurrency(0) : tUi("dividendToModel")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.blockquote
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease }}
        className="mt-8 border-l-[3px] border-gold bg-gold/[0.05] px-6 py-5 max-w-[820px]"
      >
        <p className="text-sm text-carbon leading-relaxed">{t(taxNoteKey)}</p>
      </motion.blockquote>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease, delay: 0.1 }}
        className="mt-8 max-w-[820px]"
      >
        <p className="eyebrow text-carbon-muted">{tUi("whyBulgariaTitle")}</p>
        <p className="mt-3 text-sm text-carbon leading-relaxed">
          {t(whyBulgariaKey)}
        </p>
      </motion.div>
    </>
  );
}

/* ---------------- ROLE CARD ---------------- */

type Position = (typeof governance.roles.positions)[number];

function RoleCard({ position, index }: { position: Position; index: number }) {
  const t = useTranslations();
  const tUi = useTranslations("governance.ui");
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
          <p className="mt-2 eyebrow text-carbon-muted">
            {t(position.titleKey)}
          </p>
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
          {t(position.roleTypeKey)}
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
              {tUi("residence")}:
            </span>
            <span className="text-carbon">{t(position.basedKey)}</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock
            className="h-4 w-4 text-carbon-muted shrink-0 mt-0.5"
            strokeWidth={1.4}
          />
          <div className="text-[13px] leading-snug">
            <span className="eyebrow text-carbon-muted mr-2">
              {tUi("commitment")}:
            </span>
            <span className="text-carbon">{t(position.timeCommitmentKey)}</span>
          </div>
        </div>
      </div>

      <p className="mt-6 eyebrow text-gold">{tUi("scope")}</p>
      <p className="mt-2 text-sm text-carbon leading-relaxed">
        {t(position.scopeKey)}
      </p>

      <p className="mt-5 eyebrow text-gold">{tUi("responsibilities")}</p>
      <ul className="mt-2 space-y-1.5">
        {position.responsibilitiesKeys.map((r) => (
          <li
            key={r}
            className="flex items-start gap-2 text-[13px] text-carbon leading-snug"
          >
            <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-gold shrink-0" />
            <span>{t(r)}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

/* ---------------- DECISION MATRIX ---------------- */

type MatrixRow = (typeof governance.decision_matrix.matrix)[number];
type LegendKeys = typeof governance.decision_matrix.legendKeys;

function DecisionMatrix({
  rows,
  legendKeys,
}: {
  rows: MatrixRow[];
  legendKeys: LegendKeys;
}) {
  const t = useTranslations();
  const tUi = useTranslations("governance.ui");

  return (
    <>
      <div className="mt-10 border border-hairline overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-hairline bg-white">
              <Th className="w-[40%]">{tUi("decisionHeader")}</Th>
              <Th className="w-[20%]">{tUi("mdHeader")}</Th>
              <Th className="w-[20%]">{tUi("ceoHeader")}</Th>
              <Th className="w-[20%]">{tUi("boardHeader")}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.decisionKey}
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
                    {t(r.decisionKey)}
                  </span>
                </Td>
                <Td>
                  <MatrixBadge valueKey={r.mdKey} />
                </Td>
                <Td>
                  <MatrixBadge valueKey={r.ceoKey} />
                </Td>
                <Td>
                  <MatrixBadge valueKey={r.boardKey} />
                </Td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="eyebrow text-carbon-muted">{tUi("legendLabel")}</p>
        {(Object.entries(legendKeys) as Array<[keyof LegendKeys, string]>).map(
          ([kind, key]) => (
            <div key={kind} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-block px-1.5 py-0.5 text-[9px] uppercase tracking-micro border",
                  badgeStyleForKind(kind)
                )}
              >
                {t(key)}
              </span>
            </div>
          )
        )}
      </div>
    </>
  );
}

function MatrixBadge({ valueKey }: { valueKey: string }) {
  const t = useTranslations();
  const kind = tailKey(valueKey);
  if (kind === "dash") {
    return <span className="text-carbon-muted/60 text-center block">—</span>;
  }
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-[10px] uppercase tracking-micro border",
        badgeStyleForKind(kind)
      )}
    >
      {t(valueKey)}
    </span>
  );
}

/* ---------------- FLOW CARD ---------------- */

type Flow = (typeof governance.contractual_flows.flows)[number];

function FlowCard({ flow, index }: { flow: Flow; index: number }) {
  const t = useTranslations();
  const tUi = useTranslations("governance.ui");
  const Icon = CONTRACT_ICON[flow.icon] ?? BookLock;

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
          {t(flow.typeKey)}
        </span>
      </div>

      <p className="mt-5 eyebrow">{tUi("objectLabel")}</p>
      <p className="mt-2 text-sm text-carbon leading-relaxed">
        {t(flow.whatKey)}
      </p>

      <p className="mt-5 eyebrow">{tUi("considerationLabel")}</p>
      <p className="mt-2 font-serif text-base text-navy">
        {t(flow.considerationKey)}
      </p>

      <p className="mt-auto pt-5 text-[11px] italic text-carbon-muted leading-relaxed">
        {t(flow.noteKey)}
      </p>
    </motion.div>
  );
}

/* ---------------- CAPITAL BREAKDOWN ---------------- */

type CapItem = (typeof governance.capital_structure.items)[number];

function CapitalBreakdown({ items }: { items: CapItem[] }) {
  const t = useTranslations();
  const tUi = useTranslations("governance.ui");
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
            key={row.componentKey}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease, delay: i * 0.1 }}
            className="grid grid-cols-12 items-start gap-4 p-5 border-b border-hairline"
          >
            <div className="col-span-4 md:col-span-3">
              <p className="font-serif text-navy text-[15px]">
                {t(row.componentKey)}
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
                {t(row.noteKey)}
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
          {tUi("capitalTotal")}
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
