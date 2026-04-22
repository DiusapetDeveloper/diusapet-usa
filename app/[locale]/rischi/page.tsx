"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import {
  ArrowRight,
  Banknote,
  DoorOpen,
  FileSignature,
  Flag,
  MapPin,
  PackageOpen,
  Plane,
  ShieldAlert,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { KPICard } from "@/components/kpi-card";
import risksData from "@/data/risks.json";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const {
  meta,
  headline_kpi,
  risk_matrix,
  stress_tests,
  mitigation_levers,
  feasibility_comparison,
  decalogo,
  final_callout,
} = risksData;

const RISK_ICON: Record<string, LucideIcon> = {
  Passport: Plane, // Passport not available — Plane is the closest (visa/travel)
  TrendingDown,
  ShieldAlert,
  Flag,
  MapPin,
};

const LEVER_ICON: Record<string, LucideIcon> = {
  Banknote,
  DoorOpen,
  PackageOpen,
  FileSignature,
};

const PROB_LEVELS = risk_matrix.probability_levels;
const IMPACT_LEVELS = risk_matrix.impact_levels;

const SEVERITY_RANK: Record<string, number> = {
  Critico: 4,
  Alto: 3,
  Medio: 2,
  Basso: 1,
};

export default function RischiPage() {
  const [hoveredRisk, setHoveredRisk] = useState<string | null>(null);

  const stressSorted = [...stress_tests.data].sort(
    (a, b) =>
      (SEVERITY_RANK[b.severity] ?? 0) - (SEVERITY_RANK[a.severity] ?? 0)
  );

  return (
    <div className="container py-8">
      {/* HERO */}
      <AnimatedSection>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="eyebrow text-gold">07 · Rischi e mitigazioni</p>
            <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
              {meta.title}.
            </h1>
            <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
              {meta.subtitle}
            </p>
          </div>
          <p className="text-xs text-carbon-muted max-w-xs text-right leading-relaxed">
            {meta.source}
          </p>
        </div>
      </AnimatedSection>

      {/* KPI STRIP */}
      <section className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {headline_kpi.map((k, i) => (
            <KPICard
              key={k.label}
              label={k.label}
              value={k.value}
              unit={k.unit}
              delay={i * 0.15}
            />
          ))}
        </div>
      </section>

      {/* RISK MATRIX */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">Matrice rischi</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {risk_matrix.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {risk_matrix.subtitle}
        </p>

        <div className="mt-10 grid lg:grid-cols-[420px_1fr] gap-8 items-start">
          <div className="lg:sticky lg:top-28 border border-hairline bg-white p-6">
            <RiskMatrixSvg
              risks={risk_matrix.risks}
              hoveredRisk={hoveredRisk}
              onHover={setHoveredRisk}
            />
            <div className="mt-4 flex items-center gap-4 text-[11px] text-carbon-muted">
              <LegendDot color="#5A6B4D" label="Basso" />
              <LegendDot color="#B8925A" label="Medio" />
              <LegendDot color="#7A2E2E" label="Alto" />
            </div>
          </div>

          <div className="space-y-6">
            {risk_matrix.risks.map((r, i) => (
              <RiskCard
                key={r.id}
                risk={r}
                index={i}
                hovered={hoveredRisk === r.id}
                onHover={setHoveredRisk}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* STRESS TESTS */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">{stress_tests.title.replace(/\.$/, "")}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          Sei what-if quantificati.
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {stress_tests.subtitle}
        </p>

        <div className="mt-10 border border-hairline overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="border-b border-hairline bg-white">
                <Th className="w-[38%]">Scenario</Th>
                <Th className="w-[18%] text-right">Impatto EBITDA</Th>
                <Th className="w-[14%]">Severità</Th>
                <Th className="w-[30%]">Gestibilità</Th>
              </tr>
            </thead>
            <tbody>
              {stressSorted.map((s, i) => (
                <motion.tr
                  key={s.scenario}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, ease, delay: i * 0.05 }}
                  className="border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors"
                >
                  <Td>
                    <span className="font-serif text-navy">{s.scenario}</span>
                  </Td>
                  <Td className="text-right num font-serif text-[#7A2E2E]">
                    −$
                    {Math.abs(s.ebitda_impact_usd).toLocaleString("it-IT")}
                  </Td>
                  <Td>
                    <SeverityBadge s={s.severity} />
                  </Td>
                  <Td>
                    <span className="text-xs text-carbon-muted leading-relaxed">
                      {s.manageability}
                    </span>
                  </Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedSection>

      {/* MITIGATION LEVERS */}
      <AnimatedSection stagger className="mt-24">
        <p className="eyebrow">Leve di mitigazione</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          {mitigation_levers.title}
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
          {mitigation_levers.levers.map((l, i) => {
            const Icon = LEVER_ICON[l.icon] ?? Banknote;
            return (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                className="bg-white p-8 flex flex-col"
              >
                <Icon className="h-5 w-5 text-navy" strokeWidth={1.2} />
                <h3 className="mt-6 font-serif text-[17px] text-navy leading-snug">
                  {l.name}
                </h3>
                <p className="mt-5 font-serif text-2xl text-gold num leading-none">
                  {l.amount}
                </p>
                <p className="mt-auto pt-5 text-xs text-carbon-muted leading-relaxed">
                  {l.note}
                </p>
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* FEASIBILITY COMPARISON */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">Feasibility score</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {feasibility_comparison.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {feasibility_comparison.subtitle}
        </p>

        <div className="mt-12 flex items-center justify-center gap-8 py-12 border-y border-hairline">
          <div className="text-center">
            <p className="font-serif text-5xl text-carbon-muted num leading-none">
              {feasibility_comparison.baseline_score}
              <span className="text-2xl text-carbon-muted/70">/100</span>
            </p>
            <p className="mt-3 eyebrow text-carbon-muted">Baseline</p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <ArrowRight
              className="h-8 w-8 text-gold"
              strokeWidth={1.5}
            />
          </motion.div>
          <div className="text-center">
            <p className="font-serif text-7xl md:text-8xl text-navy num leading-none">
              {feasibility_comparison.recalibrated_score}
              <span className="text-3xl text-navy/70">/100</span>
            </p>
            <p className="mt-3 eyebrow text-navy">Ricalibrato</p>
            <p className="mt-2 font-serif text-xl text-gold num">
              +{feasibility_comparison.delta} punti
            </p>
          </div>
        </div>

        <div className="mt-10 border border-hairline overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-hairline bg-white">
                <Th className="w-[34%]">Dimensione</Th>
                <Th className="w-[12%] text-right">Peso</Th>
                <Th className="w-[18%] text-right">Baseline</Th>
                <Th className="w-[18%] text-right">Ricalibrato</Th>
                <Th className="w-[18%] text-right">Delta</Th>
              </tr>
            </thead>
            <tbody>
              {feasibility_comparison.dimensions.map((d, i) => {
                const delta = d.recalibrated - d.baseline;
                const maxDelta = Math.max(
                  ...feasibility_comparison.dimensions.map(
                    (x) => x.recalibrated - x.baseline
                  )
                );
                const isMaxDelta = delta === maxDelta && delta > 0;
                return (
                  <motion.tr
                    key={d.dimension}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease, delay: i * 0.05 }}
                    className={cn(
                      "border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors",
                      isMaxDelta && "bg-gold/[0.05]"
                    )}
                  >
                    <Td>
                      <span className="font-serif text-navy">
                        {d.dimension}
                      </span>
                    </Td>
                    <Td className="text-right num text-xs text-carbon-muted">
                      {d.weight}%
                    </Td>
                    <Td className="text-right num text-carbon-muted">
                      {d.baseline}
                    </Td>
                    <Td className="text-right num text-navy">
                      {d.recalibrated}
                    </Td>
                    <Td className="text-right">
                      <span
                        className={cn(
                          "font-serif num",
                          delta > 0
                            ? "text-gold"
                            : delta < 0
                            ? "text-[#7A2E2E]"
                            : "text-carbon-muted"
                        )}
                      >
                        {delta > 0 ? "+" : ""}
                        {delta}
                      </span>
                    </Td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AnimatedSection>

      {/* DECALOGO */}
      <AnimatedSection className="mt-24">
        <p className="eyebrow">Aspettative realistiche</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {decalogo.title}
        </h2>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {decalogo.subtitle}
        </p>

        <ul className="mt-12 border-y border-hairline divide-y divide-hairline">
          {decalogo.items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease, delay: i * 0.04 }}
              className="grid grid-cols-[84px_1fr] gap-6 items-baseline py-6"
            >
              <span className="font-serif text-4xl text-gold num leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-base md:text-lg text-navy leading-snug">
                {item}
              </span>
            </motion.li>
          ))}
        </ul>
      </AnimatedSection>

      {/* FINAL CALLOUT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease }}
        className="mt-24 border-l-[4px] border-gold bg-gold/[0.05] px-8 md:px-12 py-12"
      >
        <p className="eyebrow text-gold">Bottom line</p>
        <p className="mt-5 font-serif text-xl md:text-2xl text-navy leading-relaxed max-w-4xl">
          {final_callout}
        </p>
      </motion.div>
    </div>
  );
}

/* ---------------- RISK MATRIX SVG ---------------- */

type Risk = (typeof risk_matrix.risks)[number];

function severityColor(probIdx: number, impactIdx: number): string {
  const score = probIdx + 2 * impactIdx;
  if (score >= 5) return "#7A2E2E";
  if (score >= 3) return "#B8925A";
  return "#5A6B4D";
}

function RiskMatrixSvg({
  risks,
  hoveredRisk,
  onHover,
}: {
  risks: Risk[];
  hoveredRisk: string | null;
  onHover: (id: string | null) => void;
}) {
  const VIEW_W = 420;
  const VIEW_H = 240;
  const X_PAD = 72;
  const Y_PAD_TOP = 12;
  const Y_PAD_BOT = 42;
  const CELL_W = (VIEW_W - X_PAD - 12) / PROB_LEVELS.length;
  const CELL_H = (VIEW_H - Y_PAD_TOP - Y_PAD_BOT) / IMPACT_LEVELS.length;

  function cellCenter(probIdx: number, impactIdx: number) {
    const cx = X_PAD + CELL_W * (probIdx + 0.5);
    // impact: Alto (2) on top, Basso (0) on bottom
    const cy =
      Y_PAD_TOP + CELL_H * (IMPACT_LEVELS.length - 1 - impactIdx + 0.5);
    return { cx, cy };
  }

  const { ref, inView } = useInView({ threshold: 0.25, triggerOnce: true });

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="w-full h-auto"
      aria-label="Matrice rischi probabilità per impatto"
    >
      {/* Grid cells */}
      {IMPACT_LEVELS.map((_, impIdx) =>
        PROB_LEVELS.map((_, probIdx) => {
          const x = X_PAD + probIdx * CELL_W;
          const y =
            Y_PAD_TOP + (IMPACT_LEVELS.length - 1 - impIdx) * CELL_H;
          const score = probIdx + 2 * impIdx;
          const bg =
            score >= 5
              ? "rgba(122, 46, 46, 0.06)"
              : score >= 3
              ? "rgba(184, 146, 90, 0.08)"
              : "rgba(90, 107, 77, 0.05)";
          return (
            <rect
              key={`cell-${probIdx}-${impIdx}`}
              x={x}
              y={y}
              width={CELL_W}
              height={CELL_H}
              fill={bg}
              stroke="#E6E8EC"
              strokeWidth={0.5}
            />
          );
        })
      )}

      {/* Y-axis labels (impact, top=Alto, bottom=Basso) */}
      {IMPACT_LEVELS.map((label, impIdx) => {
        const y =
          Y_PAD_TOP +
          (IMPACT_LEVELS.length - 1 - impIdx) * CELL_H +
          CELL_H / 2;
        return (
          <text
            key={`imp-${label}`}
            x={X_PAD - 10}
            y={y + 3.5}
            textAnchor="end"
            fontSize={10}
            fill="#5B6470"
            style={{
              fontFamily: "var(--font-plex-sans), sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {label}
          </text>
        );
      })}

      {/* X-axis labels (prob) */}
      {PROB_LEVELS.map((label, probIdx) => {
        const x = X_PAD + probIdx * CELL_W + CELL_W / 2;
        return (
          <text
            key={`prob-${label}`}
            x={x}
            y={VIEW_H - Y_PAD_BOT + 14}
            textAnchor="middle"
            fontSize={9}
            fill="#5B6470"
            style={{
              fontFamily: "var(--font-plex-sans), sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {label}
          </text>
        );
      })}

      {/* Axis titles */}
      <text
        x={X_PAD + (VIEW_W - X_PAD) / 2}
        y={VIEW_H - 6}
        textAnchor="middle"
        fontSize={10}
        fill="#0B1E3F"
        style={{
          fontFamily: "var(--font-plex-sans), sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
        }}
      >
        Probabilità →
      </text>
      <text
        x={14}
        y={Y_PAD_TOP + (VIEW_H - Y_PAD_TOP - Y_PAD_BOT) / 2}
        textAnchor="middle"
        fontSize={10}
        fill="#0B1E3F"
        transform={`rotate(-90, 14, ${
          Y_PAD_TOP + (VIEW_H - Y_PAD_TOP - Y_PAD_BOT) / 2
        })`}
        style={{
          fontFamily: "var(--font-plex-sans), sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
        }}
      >
        Impatto →
      </text>

      {/* Risk dots */}
      {risks.map((r, i) => {
        const probIdx = PROB_LEVELS.indexOf(r.probability_label);
        const impactIdx = IMPACT_LEVELS.indexOf(r.impact);
        if (probIdx < 0 || impactIdx < 0) return null;
        const { cx, cy } = cellCenter(probIdx, impactIdx);
        const color = severityColor(probIdx, impactIdx);
        const isActive = hoveredRisk === r.id;

        return (
          <motion.g
            key={r.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{
              duration: 0.45,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2 + i * 0.08,
            }}
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transformBox: "fill-box",
              cursor: "pointer",
            }}
            onMouseEnter={() => onHover(r.id)}
            onMouseLeave={() => onHover(null)}
          >
            {isActive && (
              <circle
                cx={cx}
                cy={cy}
                r={14}
                fill="none"
                stroke="#B8925A"
                strokeWidth={1.5}
                strokeOpacity={0.6}
              />
            )}
            <motion.circle
              cx={cx}
              cy={cy}
              r={isActive ? 10 : 7}
              fill={color}
              stroke="white"
              strokeWidth={1.5}
              animate={{
                scale: isActive ? 1.4 : 1,
              }}
              transition={{ duration: 0.2, ease }}
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                transformBox: "fill-box",
              }}
            />
            {isActive && (
              <foreignObject
                x={cx + 12}
                y={cy - 26}
                width={200}
                height={60}
                style={{ overflow: "visible", pointerEvents: "none" }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: "#0B1E3F",
                    color: "#F5F3EE",
                    padding: "6px 10px",
                    borderRadius: 2,
                    fontSize: 10.5,
                    fontFamily: "var(--font-plex-sans), sans-serif",
                    boxShadow: "0 6px 20px -4px rgba(0,0,0,0.3)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-plex-serif), serif",
                      fontSize: 12,
                    }}
                  >
                    {r.name}
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0 0",
                      opacity: 0.7,
                    }}
                  >
                    {r.probability_pct}% · {r.impact}
                  </p>
                </div>
              </foreignObject>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}

/* ---------------- RISK CARD ---------------- */

function RiskCard({
  risk,
  index,
  hovered,
  onHover,
}: {
  risk: Risk;
  index: number;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const Icon = RISK_ICON[risk.icon] ?? Flag;
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease, delay: index * 0.06 }}
      onMouseEnter={() => onHover(risk.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "relative border bg-white p-6 md:p-8 transition-all duration-300",
        hovered
          ? "border-gold shadow-elev"
          : "border-hairline"
      )}
    >
      <div className="flex items-start gap-5">
        <div
          className={cn(
            "h-11 w-11 shrink-0 flex items-center justify-center rounded-full transition-colors",
            hovered ? "bg-gold/25" : "bg-gold/15"
          )}
        >
          <Icon className="h-5 w-5 text-navy" strokeWidth={1.3} />
        </div>

        <div className="flex-1">
          <h3 className="font-serif text-[18px] text-navy leading-snug">
            {risk.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ProbBadge
              probPct={risk.probability_pct}
              probLabel={risk.probability_label}
            />
            <ImpactBadge impact={risk.impact} />
          </div>
          <p className="mt-4 text-sm text-carbon leading-relaxed">
            {risk.description}
          </p>
          <p className="mt-5 eyebrow text-gold">Piano di risposta</p>
          <p className="mt-2 text-[13px] text-carbon-muted leading-relaxed">
            {risk.response_plan}
          </p>
          <p className="mt-4 text-[11px] text-carbon-muted">
            Owner:{" "}
            <span className="text-navy">{risk.owner}</span>
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function ProbBadge({
  probPct,
  probLabel,
}: {
  probPct: number;
  probLabel: string;
}) {
  const color =
    probPct >= 30 ? "#7A2E2E" : probPct >= 20 ? "#B8925A" : "#5A6B4D";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-micro border num"
      style={{ color, borderColor: color }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      Probabilità {probPct}% · {probLabel}
    </span>
  );
}

function ImpactBadge({ impact }: { impact: string }) {
  const color =
    impact === "Alto"
      ? "#7A2E2E"
      : impact === "Medio"
      ? "#B8925A"
      : "#5A6B4D";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-micro border"
      style={{ color, borderColor: color }}
    >
      Impatto {impact}
    </span>
  );
}

/* ---------------- SEVERITY / TABLE PRIMITIVES ---------------- */

function SeverityBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    Basso: "text-carbon-muted border-hairline",
    Medio: "text-gold border-gold",
    Alto: "text-navy bg-navy/[0.06] border-navy",
    Critico: "text-white border-[#7A2E2E]",
  };
  const style =
    s === "Critico"
      ? { backgroundColor: "#7A2E2E" }
      : undefined;
  return (
    <span
      style={style}
      className={cn(
        "inline-block px-2 py-0.5 text-[10px] uppercase tracking-micro border",
        map[s] ?? map.Basso
      )}
    >
      {s}
    </span>
  );
}

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
