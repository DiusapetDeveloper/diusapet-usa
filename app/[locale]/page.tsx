"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { KPICard } from "@/components/kpi-card";
import { AnimatedSection } from "@/components/animated-section";

const WorldBridge = dynamic(() => import("@/components/world-bridge"), {
  ssr: false,
  loading: () => (
    <section className="py-24 md:py-32">
      <div className="container">
        <div className="min-h-[560px] flex items-center justify-center">
          <p className="eyebrow text-carbon-muted">Loading…</p>
        </div>
      </div>
    </section>
  ),
});

const ease = [0.22, 1, 0.36, 1] as const;

const KPI_KEYS = ["market", "margin", "breakeven", "roi"] as const;

const INDEX_SECTIONS = [
  { key: "mercato", href: "/mercato" },
  { key: "prodotto", href: "/prodotto" },
  { key: "operativo", href: "/operativo" },
  { key: "finanziario", href: "/finanziario" },
  { key: "clienti", href: "/clienti" },
  { key: "roadmap", href: "/roadmap" },
] as const;

export default function Home() {
  const t = useTranslations("home");

  return (
    <>
      <section className="container pt-8 md:pt-16 pb-28">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="eyebrow text-gold"
        >
          {t("hero.eyebrow")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="mt-6 font-serif text-navy text-display max-w-5xl"
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg text-carbon-muted leading-relaxed"
        >
          {t("hero.subtitle")}
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
            {t("hero.ctaPrimary")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/finanziario"
            className="group inline-flex items-center gap-2 text-navy border-b border-navy/30 hover:border-gold pb-1 text-sm transition-colors"
          >
            {t("hero.ctaSecondary")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </section>

      <section className="container relative pb-28">
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
              <p className="eyebrow">{t("kpi.eyebrow")}</p>
              <h2 className="mt-3 font-serif text-hero text-navy max-w-xl">
                {t("kpi.title")}
              </h2>
            </div>
            <p className="hidden md:block text-xs text-carbon-muted max-w-xs text-right">
              {t("kpi.source")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KPI_KEYS.map((k, i) => (
              <KPICard
                key={k}
                label={t(`kpi.${k}.label`)}
                value={t(`kpi.${k}.value`)}
                unit={t(`kpi.${k}.unit`)}
                trend={t(`kpi.${k}.trend`)}
                caption={t(`kpi.${k}.caption`)}
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
        <p className="eyebrow">{t("index.eyebrow")}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          {t("index.title")}
        </h2>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
          {INDEX_SECTIONS.map((s, i) => (
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
                  {t(`index.sections.${s.key}.label`)}
                </h3>
                <p className="mt-3 text-sm text-carbon-muted num">
                  {t(`index.sections.${s.key}.hint`)}
                </p>
                <ArrowUpRight className="absolute top-8 right-8 h-4 w-4 text-carbon-muted transition-all group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}
