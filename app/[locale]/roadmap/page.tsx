"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/animated-section";
import { GanttChart } from "@/components/gantt-chart";
import { KPICard } from "@/components/kpi-card";
import roadmap from "@/data/roadmap.json";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const {
  meta,
  headline_kpi,
  workstreams,
  view_90days,
  view_36months,
  critical_path_90days,
  phase_labels,
} = roadmap;

type View = "90days" | "36months";

export default function RoadmapPage() {
  const t = useTranslations("roadmap");
  const tCommon = useTranslations("common");
  const [view, setView] = useState<View>("90days");

  return (
    <div className="container py-8">
      {/* HERO */}
      <AnimatedSection>
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="eyebrow text-gold">{t("hero.eyebrow")}</p>
            <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <p className="mt-4 text-xs text-carbon-muted leading-relaxed">
              {tCommon("source")}: {t("hero.source")}
            </p>
          </div>
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

      {/* TOGGLE + GANTT */}
      <AnimatedSection className="mt-20">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="eyebrow">{t("gantt.eyebrow")}</p>
            <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
              {t("gantt.title")}
            </h2>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1 p-1 border border-hairline bg-white">
            <ViewButton
              active={view === "90days"}
              onClick={() => setView("90days")}
              layoutId="roadmap-toggle"
            >
              {t("toggles.days90")}
            </ViewButton>
            <ViewButton
              active={view === "36months"}
              onClick={() => setView("36months")}
              layoutId="roadmap-toggle"
            >
              {t("toggles.months36")}
            </ViewButton>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
          >
            {view === "90days" ? (
              <GanttChart
                workstreams={workstreams}
                tasks={view_90days.tasks}
                milestones={view_90days.milestones}
                totalUnits={view_90days.total_weeks}
                unitPrefix="W"
              />
            ) : (
              <GanttChart
                workstreams={workstreams}
                tasks={view_36months.tasks}
                milestones={view_36months.milestones}
                totalUnits={view_36months.total_months}
                unitPrefix="M"
                phaseLabels={phase_labels}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* LEGEND */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-hairline py-4">
          <p className="eyebrow text-carbon-muted">Workstream</p>
          {workstreams.map((w) => (
            <div key={w.id} className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: w.color }}
              />
              <span className="text-xs text-carbon-muted">{w.label}</span>
            </div>
          ))}
          <span className="hidden md:inline-block h-4 w-px bg-hairline mx-2" />
          <div className="flex items-center gap-2">
            <DiamondIcon />
            <span className="text-xs text-carbon-muted">Milestone</span>
          </div>
          <div className="flex items-center gap-2">
            <DiamondIcon critical />
            <span className="text-xs text-carbon-muted">Milestone critica</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-4"
              style={{
                backgroundColor: "#5A6B4D",
                outline: "1.5px solid #B8925A",
                outlineOffset: -1,
              }}
            />
            <span className="text-xs text-carbon-muted">Task cammino critico</span>
          </div>
        </div>
      </AnimatedSection>

      {/* CRITICAL PATH (90days) */}
      <AnimatePresence mode="wait">
        {view === "90days" && (
          <motion.section
            key="critical-path"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease }}
            className="mt-24"
          >
            <p className="eyebrow">{t("criticalPath.eyebrow")}</p>
            <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
              {t("criticalPath.title")}
            </h2>

            <ul className="mt-10 border-y border-hairline divide-y divide-hairline">
              {critical_path_90days.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    ease,
                    delay: i * 0.06,
                  }}
                  className="grid grid-cols-[72px_1fr] gap-6 items-baseline py-6"
                >
                  <span className="font-serif text-4xl text-gold num leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base md:text-lg text-navy leading-snug">
                    {step}
                  </span>
                </motion.li>
              ))}
            </ul>

            <p className="mt-6 text-xs text-carbon-muted leading-relaxed max-w-2xl">
              {t("criticalPath.note")}
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* PHASES (36months) */}
      <AnimatePresence mode="wait">
        {view === "36months" && (
          <motion.section
            key="phases"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease }}
            className="mt-24"
          >
            <p className="eyebrow">{t("phases.eyebrow")}</p>
            <h2 className="mt-3 font-serif text-hero text-navy max-w-3xl">
              {t("phases.title")}
            </h2>

            <div className="mt-10 flex flex-col gap-3">
              {phase_labels.map((p, i) => {
                const widthPct = ((p.to - p.from + 1) / 36) * 100;
                return (
                  <motion.div
                    key={p.phase}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className="border-l-2 border-gold bg-gold/[0.08] py-5 px-6 flex items-baseline gap-6"
                      style={{ width: `${widthPct}%`, minWidth: 180 }}
                    >
                      <span className="eyebrow text-gold whitespace-nowrap">
                        {p.phase}
                      </span>
                      <span className="text-[11px] text-carbon-muted num whitespace-nowrap">
                        M{p.from}–M{p.to}
                      </span>
                    </div>
                    <p className="text-sm text-carbon-muted leading-relaxed flex-1">
                      {p.note}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CALLOUT */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease }}
        className="mt-24 border-l-4 border-gold bg-gold/[0.04] px-6 md:px-10 py-8"
      >
        <p className="eyebrow text-gold">{t("callout.eyebrow")}</p>
        <p className="mt-3 font-serif text-xl md:text-2xl text-navy leading-relaxed max-w-3xl">
          {t("callout.text")}
        </p>
      </motion.div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  children,
  layoutId,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  layoutId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative px-5 py-2 text-sm tracking-tight transition-colors",
        active ? "text-white" : "text-carbon-muted hover:text-navy"
      )}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 bg-navy"
          transition={{ duration: 0.35, ease }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function DiamondIcon({ critical }: { critical?: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <polygon
        points="5,0 10,5 5,10 0,5"
        fill="#B8925A"
        stroke={critical ? "#0B1E3F" : "none"}
        strokeWidth={critical ? 1.5 : 0}
      />
    </svg>
  );
}
