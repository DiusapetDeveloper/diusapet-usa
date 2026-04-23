"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MessageCircle,
  Package,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import outreach from "@/data/outreach.json";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const {
  kpi_weekly,
  follow_up_sequence,
  email_templates,
  subject_patterns,
  cta_formulas,
  three_numbers,
  weekly_routine,
  funnel_kpi,
} = outreach;

const CTA_ICONS: Record<number, LucideIcon> = {
  0: Package,
  1: Phone,
  2: MessageCircle,
};

// Map data array index → message key
const TOUCH_KEYS = ["t0", "t5", "t12", "t22", "t90"] as const;
const CTA_ITEM_KEYS = ["freeSample", "introCall", "replyAnswer"] as const;
const NUMBER_KEYS = ["protein", "taurine", "margin"] as const;
const ROUTINE_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri"] as const;
const FUNNEL_METRIC_KEYS = [
  "open",
  "reply",
  "positive",
  "sampleOrder",
  "velocity",
  "cpa",
] as const;
const THAT_WORK_KEYS = [
  "number",
  "benefitCtx",
  "hotQuestion",
  "geoPronoun",
  "funcCuriosity",
  "problemSolution",
  "shortLower",
] as const;
const FORBIDDEN_KEYS = [
  "introducing",
  "partnership",
  "revolutionary",
  "fakeRe",
  "caps",
  "tooLong",
] as const;

// Map Italian psychological cost value to message cost key
const COST_KEY_MAP: Record<string, string> = {
  Bassissimo: "veryLow",
  Minimale: "minimal",
  Zero: "zero",
};

// Map weekly KPI array index → label suffix used only via t().
// KPIs keep raw value from data; label is derived via mapping below.
const KPI_LABEL_FROM_ORIG: Record<string, string> = {
  "Email prima-touch / settimana": "firstTouch",
  "Follow-up inviati / settimana": "followUps",
  "Chiamate / settimana": "calls",
  "Visite in-store / settimana": "visits",
};

export default function OutreachSection() {
  const t = useTranslations("outreach");

  return (
    <section className="mt-32 pt-16 border-t border-gold/60">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="eyebrow text-gold">{t("eyebrow")}</p>
          <h2 className="mt-4 font-serif text-hero text-navy max-w-3xl">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
            {outreach.meta.subtitle}
          </p>
        </div>
        <p className="text-xs text-carbon-muted max-w-xs text-right leading-relaxed">
          {outreach.meta.source}
        </p>
      </div>

      {/* 2 — KPI WEEKLY (labels from data; values numeric) */}
      <div className="mt-16">
        <p className="eyebrow">{t("weeklyKpiTitle")}</p>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
          {kpi_weekly.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease, delay: i * 0.08 }}
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
                  <span className="font-serif text-base text-navy/70">
                    {k.unit}
                  </span>
                )}
              </div>
              <div className="mt-4 h-px w-8 bg-gold" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3 — FOLLOW-UP SEQUENCE */}
      <div className="mt-28">
        <p className="eyebrow">{t("sectionEyebrows.followUp")}</p>
        <h3 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t("followUp.title")}
        </h3>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t("followUp.subtitle")}
        </p>

        <FollowUpTimeline />

        <blockquote className="mt-10 border-l-2 border-gold pl-6 max-w-[720px]">
          <p className="font-serif italic text-base md:text-[17px] text-navy leading-relaxed">
            {t("followUp.insight")}
          </p>
        </blockquote>
      </div>

      {/* 4 — EMAIL TEMPLATES CAROUSEL */}
      <div className="mt-28">
        <p className="eyebrow">{t("sectionEyebrows.templates")}</p>
        <h3 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t("templates.title")}
        </h3>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t("templates.subtitle")}
        </p>

        <TemplatesCarousel />
      </div>

      {/* 5 — SUBJECT PATTERNS */}
      <div className="mt-28">
        <p className="eyebrow">{t("sectionEyebrows.subjects")}</p>
        <h3 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t("subjects.title")}
        </h3>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t("subjects.subtitle")}
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-px bg-hairline border border-hairline">
          <div className="bg-white p-6">
            <p className="eyebrow text-[#5A6B4D]">{t("subjects.thatWork")}</p>
            <ul className="mt-4 divide-y divide-hairline">
              {subject_patterns.that_work.map((s, i) => {
                const key = THAT_WORK_KEYS[i];
                return (
                  <li key={key ?? s.pattern} className="py-4">
                    <p className="font-serif text-navy text-[15px]">
                      {key
                        ? t(`subjects.thatWorkItems.${key}.pattern`)
                        : s.pattern}
                    </p>
                    <p className="mt-1.5 font-mono text-[12px] italic text-carbon bg-hairline/30 px-2 py-1 inline-block">
                      {s.example}
                    </p>
                    <p className="mt-2 text-xs text-carbon-muted">
                      <span className="eyebrow text-carbon-muted mr-1">
                        {t("subjects.reason")}:
                      </span>
                      {key ? t(`subjects.thatWorkItems.${key}.why`) : s.why}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-white p-6">
            <p className="eyebrow text-[#7A2E2E]">{t("subjects.forbidden")}</p>
            <ul className="mt-4 divide-y divide-hairline">
              {subject_patterns.forbidden.map((s, i) => {
                const key = FORBIDDEN_KEYS[i];
                return (
                  <li key={key ?? s.pattern} className="py-4">
                    <p
                      className="font-serif text-[14px]"
                      style={{ color: "#7A2E2E" }}
                    >
                      {key
                        ? t(`subjects.forbiddenItems.${key}.pattern`)
                        : s.pattern}
                    </p>
                    <p className="mt-2 text-xs text-carbon-muted leading-relaxed">
                      {key
                        ? t(`subjects.forbiddenItems.${key}.reason`)
                        : s.reason}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* 6 — CTA FORMULAS */}
      <div className="mt-28">
        <p className="eyebrow">{t("sectionEyebrows.cta")}</p>
        <h3 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t("cta.title")}
        </h3>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t("cta.subtitle")}
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
          {cta_formulas.items.map((c, i) => {
            const Icon = CTA_ICONS[i] ?? Package;
            const itemKey = CTA_ITEM_KEYS[i];
            const costKey = COST_KEY_MAP[c.psychological_cost];
            const costColor =
              costKey === "zero" || costKey === "veryLow"
                ? "#5A6B4D"
                : "#B8925A";
            const costLabel = costKey
              ? t(`cta.costs.${costKey}`)
              : c.psychological_cost;
            return (
              <motion.div
                key={itemKey ?? c.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                className="bg-white p-8 flex flex-col"
              >
                <Icon className="h-5 w-5 text-navy" strokeWidth={1.2} />
                <h4 className="mt-5 font-serif text-[18px] text-navy leading-snug">
                  {itemKey ? t(`cta.items.${itemKey}.name`) : c.name}
                </h4>
                <p className="mt-4 font-mono text-[13px] italic text-carbon bg-hairline/40 px-3 py-2 leading-relaxed">
                  {c.phrasing}
                </p>
                <p className="mt-4 text-xs text-carbon-muted leading-relaxed">
                  {itemKey ? t(`cta.items.${itemKey}.use`) : c.use}
                </p>
                <div className="mt-auto pt-5">
                  <span
                    className="inline-block px-2 py-1 text-[10px] uppercase tracking-micro border"
                    style={{ color: costColor, borderColor: costColor }}
                  >
                    {t("cta.psychCost")}: {costLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 7 — THREE NUMBERS */}
      <div className="mt-28">
        <p className="eyebrow">{t("sectionEyebrows.numbers")}</p>
        <h3 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t("numbers.title")}
        </h3>
        <p className="mt-4 max-w-2xl text-carbon-muted leading-relaxed">
          {t("numbers.subtitle")}
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
          {three_numbers.numbers.map((n, i) => {
            const numKey = NUMBER_KEYS[i];
            return (
              <motion.div
                key={numKey ?? n.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                className="bg-white p-8 flex flex-col"
              >
                <p className="font-serif text-5xl md:text-6xl text-navy num leading-none">
                  {n.value}
                </p>
                <p className="mt-3 eyebrow">
                  {numKey ? t(`numbers.items.${numKey}.label`) : n.label}
                </p>
                <div className="mt-5 h-px w-8 bg-gold" />
                <p className="mt-5 text-[13px] italic text-carbon leading-relaxed">
                  {numKey ? t(`numbers.items.${numKey}.context`) : n.context}
                </p>
                <p className="mt-auto pt-5 text-[10px] uppercase tracking-micro text-carbon-muted leading-relaxed">
                  {t("numbers.useWith")}:{" "}
                  {numKey ? t(`numbers.items.${numKey}.useWith`) : n.use_with}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 8 — WEEKLY ROUTINE */}
      <div className="mt-28">
        <p className="eyebrow">{t("sectionEyebrows.routine")}</p>
        <h3 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t("routine.title")}
        </h3>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-hairline border border-hairline">
          {weekly_routine.days.map((d, i) => {
            const dayKey = ROUTINE_DAY_KEYS[i];
            return (
              <motion.div
                key={dayKey ?? d.day}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease, delay: i * 0.06 }}
                className={cn(
                  "p-6 flex flex-col",
                  i % 2 === 0 ? "bg-navy/[0.03]" : "bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-serif text-[20px] text-navy leading-none">
                    {dayKey ? t(`routine.days.${dayKey}.day`) : d.day}
                  </h4>
                  <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-micro border border-gold text-gold num whitespace-nowrap">
                    {dayKey
                      ? t(`routine.days.${dayKey}.duration`)
                      : d.duration}
                  </span>
                </div>
                <div className="mt-4 h-px bg-hairline" />
                <ul className="mt-4 space-y-2">
                  {d.activities.map((a, ai) => (
                    <li
                      key={ai}
                      className="flex items-start gap-2 text-[13px] text-carbon leading-snug"
                    >
                      <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-gold shrink-0" />
                      <span>
                        {dayKey
                          ? t(`routine.days.${dayKey}.activities.${ai}`)
                          : a}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 9 — FUNNEL KPI TABLE */}
      <div className="mt-28">
        <p className="eyebrow">{t("sectionEyebrows.funnelKpi")}</p>
        <h3 className="mt-3 font-serif text-hero text-navy max-w-3xl">
          {t("funnelKpi.title")}
        </h3>

        <div className="mt-10 border border-hairline overflow-x-auto">
          <table className="w-full text-left min-w-[720px]">
            <thead>
              <tr className="border-b border-hairline bg-white">
                <th className="eyebrow text-left p-4 font-normal w-[24%]">
                  {t("funnelKpi.metric")}
                </th>
                <th className="eyebrow text-left p-4 font-normal w-[26%]">
                  {t("funnelKpi.formula")}
                </th>
                <th className="eyebrow text-left p-4 font-normal w-[16%]">
                  {t("funnelKpi.target")}
                </th>
                <th className="eyebrow text-left p-4 font-normal w-[34%]">
                  {t("funnelKpi.ifBelow")}
                </th>
              </tr>
            </thead>
            <tbody>
              {funnel_kpi.metrics.map((m, i) => {
                const metricKey = FUNNEL_METRIC_KEYS[i];
                return (
                  <motion.tr
                    key={metricKey ?? m.metric}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease, delay: i * 0.05 }}
                    className="border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors align-top"
                  >
                    <td className="p-4 font-serif text-navy text-[15px]">
                      {metricKey
                        ? t(`funnelKpi.metrics.${metricKey}.metric`)
                        : m.metric}
                    </td>
                    <td className="p-4 font-mono text-[12px] text-carbon-muted">
                      {metricKey
                        ? t(`funnelKpi.metrics.${metricKey}.formula`)
                        : m.formula}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 text-[11px] uppercase tracking-micro border border-gold text-gold num whitespace-nowrap">
                        {metricKey
                          ? t(`funnelKpi.metrics.${metricKey}.target`)
                          : m.target}
                      </span>
                    </td>
                    <td className="p-4 text-xs italic text-carbon-muted leading-relaxed">
                      {metricKey
                        ? t(`funnelKpi.metrics.${metricKey}.ifBelow`)
                        : m.if_below}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 10 — CLOSING CALLOUT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease }}
        className="mt-24 mb-8 border-l-[3px] border-gold bg-gold/[0.05] px-8 md:px-12 py-10"
      >
        <p className="font-serif italic text-navy text-lg md:text-xl leading-relaxed max-w-[740px] mx-auto text-center">
          {outreach.closing_callout}
        </p>
      </motion.div>
    </section>
  );
}

/* ---------------- FOLLOW-UP TIMELINE ---------------- */

function FollowUpTimeline() {
  const t = useTranslations("outreach.followUp");
  const reduce = useReducedMotion();
  return (
    <div className="mt-10 flex flex-col md:flex-row md:items-stretch gap-3 md:gap-2">
      {follow_up_sequence.touches.map((touch, i) => {
        const touchKey = TOUCH_KEYS[i];
        return (
          <div
            key={touchKey ?? touch.day}
            className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-2 flex-1"
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -20 }}
              whileInView={
                reduce ? { opacity: 1 } : { opacity: 1, x: 0 }
              }
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                ease,
                delay: reduce ? 0 : i * 0.1,
              }}
              className="flex-1 bg-white border border-hairline p-4 flex flex-col gap-3 min-h-[200px]"
            >
              <span
                className="inline-flex items-center justify-center h-9 w-9 rounded-full text-white font-serif text-sm num"
                style={{ backgroundColor: touch.color }}
              >
                {i + 1}
              </span>
              <p className="font-serif text-lg text-navy num leading-none">
                {touch.day}
              </p>
              <p className="text-[13px] text-navy font-medium leading-snug">
                {touchKey ? t(`touches.${touchKey}.name`) : touch.name}
              </p>
              <div className="h-px bg-hairline" />
              <div className="flex flex-col gap-1.5">
                <p className="eyebrow text-carbon-muted">{t("angleLabel")}</p>
                <p className="text-[12px] text-carbon-muted leading-snug">
                  {touchKey ? t(`touches.${touchKey}.angle`) : touch.angle}
                </p>
              </div>
              <p className="mt-auto text-[10px] uppercase tracking-micro text-carbon-muted">
                {t("lengthLabel")}:{" "}
                {touchKey ? t(`touches.${touchKey}.length`) : touch.length}
              </p>
            </motion.div>
            {i < follow_up_sequence.touches.length - 1 && (
              <div className="hidden md:flex items-center px-1">
                <span className="h-px w-4 bg-gold" />
                <ChevronRight
                  className="h-3 w-3 text-gold -ml-1"
                  strokeWidth={2}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- TEMPLATES CAROUSEL ---------------- */

function TemplatesCarousel() {
  const t = useTranslations("outreach.templates");
  const tEyebrows = useTranslations("outreach.sectionEyebrows");
  const reduce = useReducedMotion();
  const templates = email_templates.templates;
  const total = templates.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > index ? 1 : -1);
      setIndex(i);
    },
    [index]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const current = templates[index];
  const prevTpl = templates[(index - 1 + total) % total];
  const nextTpl = templates[(index + 1) % total];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="mt-12 relative outline-none"
    >
      <div className="relative mx-auto max-w-[900px] min-h-[640px]">
        {!reduce && (
          <div
            className="hidden lg:block absolute left-0 top-0 w-[480px] h-[600px] pointer-events-none"
            style={{
              transform: "translateX(-300px) scale(0.9)",
              transformOrigin: "center",
              opacity: 0.4,
            }}
            aria-hidden="true"
          >
            <TemplatePeekCard
              template={prevTpl}
              index={(index - 1 + total) % total}
              total={total}
            />
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: direction * 100, scale: 0.95 }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, x: 0, scale: 1 }
            }
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: direction * -100, scale: 0.95 }
            }
            transition={{ duration: 0.4, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) goNext();
              else if (info.offset.x > 100) goPrev();
            }}
            className="relative z-10 mx-auto w-full"
          >
            <TemplateFullCard
              template={current}
              index={index}
              total={total}
              t={t}
            />
          </motion.div>
        </AnimatePresence>

        {!reduce && (
          <div
            className="hidden lg:block absolute right-0 top-0 w-[480px] h-[600px] pointer-events-none"
            style={{
              transform: "translateX(300px) scale(0.9)",
              transformOrigin: "center",
              opacity: 0.4,
            }}
            aria-hidden="true"
          >
            <TemplatePeekCard
              template={nextTpl}
              index={(index + 1) % total}
              total={total}
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label={tEyebrows("prev")}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold text-gold hover:bg-gold hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
        </button>

        <div className="flex items-center gap-2">
          {templates.map((tpl, i) => (
            <button
              key={tpl.letter}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${tEyebrows("next")} ${tpl.letter}`}
              className={cn(
                "h-6 w-6 rounded-full text-[10px] font-semibold transition-all duration-200 hover:scale-110",
                i === index
                  ? "bg-gold text-white"
                  : "border border-hairline text-carbon-muted hover:border-gold hover:text-gold"
              )}
            >
              {tpl.letter}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label={tEyebrows("next")}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold text-gold hover:bg-gold hover:text-white transition-colors"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

type Template = (typeof email_templates.templates)[number];

function TemplateFullCard({
  template,
  index,
  total,
  t,
}: {
  template: Template;
  index: number;
  total: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const [copied, setCopied] = useState(false);
  const letter = template.letter;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op
    }
  };

  return (
    <article className="relative bg-white border border-hairline p-8 md:p-12 min-h-[600px] select-text">
      <span
        className="absolute top-4 right-8 pointer-events-none select-none font-serif leading-none"
        style={{
          fontSize: "8rem",
          color: "#B8925A",
          opacity: 0.18,
        }}
        aria-hidden="true"
      >
        {letter}
      </span>

      <p className="eyebrow text-carbon-muted num">
        {t("templateOf", { n: index + 1, total })}
      </p>

      <h4 className="mt-5 font-serif text-2xl text-navy leading-tight relative z-10">
        {t(`items.${letter}.name`)}
      </h4>
      <p className="mt-1 text-sm text-carbon-muted relative z-10">
        {t("targetLabel")}: {t(`items.${letter}.target`)}
      </p>

      <div className="mt-6 grid lg:grid-cols-[220px_1fr] gap-6 relative z-10">
        <div>
          <p className="eyebrow">{t("whenLabel")}</p>
          <p className="mt-2 text-sm text-carbon leading-relaxed">
            {t(`items.${letter}.when`)}
          </p>
        </div>

        <div>
          <div className="h-px w-full bg-gold mb-5 lg:hidden" />

          <p className="eyebrow">{t("subjectLabel")}</p>
          <p className="mt-2 font-mono text-[13px] text-navy bg-hairline/40 px-3 py-2 inline-block">
            {template.subject}
          </p>

          <p className="mt-5 eyebrow">{t("bodyLabel")}</p>
          <pre
            className="mt-2 font-mono text-[13px] text-carbon leading-relaxed bg-hairline/20 p-4 whitespace-pre-wrap"
            style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace" }}
          >
            {template.body}
          </pre>

          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="inline-block px-2 py-1 text-[10px] uppercase tracking-micro border border-navy text-navy">
              {t("hookTypeLabel")}: {t(`items.${letter}.hookType`)}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-micro border transition-colors",
                copied
                  ? "bg-gold text-white border-gold"
                  : "border-gold text-gold hover:bg-gold hover:text-white"
              )}
            >
              <Copy className="h-3 w-3" strokeWidth={1.8} />
              {copied ? t("copied") : t("copyButton")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function TemplatePeekCard({
  template,
  index,
  total,
}: {
  template: Template;
  index: number;
  total: number;
}) {
  const t = useTranslations("outreach.templates");
  const letter = template.letter;
  return (
    <div className="relative bg-white border border-hairline h-full p-10 overflow-hidden">
      <span
        className="absolute top-4 right-6 pointer-events-none font-serif leading-none"
        style={{
          fontSize: "7rem",
          color: "#B8925A",
          opacity: 0.12,
        }}
      >
        {letter}
      </span>
      <p className="eyebrow text-carbon-muted num">
        {t("templateOf", { n: index + 1, total })}
      </p>
      <h4 className="mt-5 font-serif text-xl text-navy leading-tight">
        {t(`items.${letter}.name`)}
      </h4>
      <p className="mt-2 text-xs text-carbon-muted">
        {t(`items.${letter}.target`)}
      </p>
    </div>
  );
}
