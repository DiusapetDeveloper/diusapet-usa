"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/animated-section";
import productsData from "@/data/products.json";
import { formatCurrency } from "@/lib/utils";

const { meta, items, differentiators } = productsData;

const DIFF_FIELDS: Array<{
  key: "protein" | "taurine" | "omega_3" | "grain_free_ratio" | "origin";
  labelKey: string;
}> = [
  { key: "protein", labelKey: "protein" },
  { key: "taurine", labelKey: "taurine" },
  { key: "omega_3", labelKey: "omega3" },
  { key: "grain_free_ratio", labelKey: "grainFree" },
  { key: "origin", labelKey: "origin" },
];

type Product = (typeof items)[number] & { image: string | null };

export default function ProdottoPage() {
  const t = useTranslations("prodotto");
  const tCommon = useTranslations("common");

  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">{t("hero.eyebrow")}</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          {t("hero.title")}
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          {t("hero.subtitle")}
        </p>
        <p className="mt-4 text-xs text-carbon-muted num">
          {t("hero.marginLabel")} {meta.margin_range} ·{" "}
          {tCommon("source").toLowerCase()}: {meta.source}
        </p>
      </AnimatedSection>

      <section className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
        {items.map((p, i) => (
          <ProductCard key={p.sku} product={p} index={i} />
        ))}
      </section>

      <AnimatedSection stagger className="mt-24">
        <p className="eyebrow">{t("differentiators.eyebrow")}</p>
        <h2 className="mt-3 font-serif text-hero text-navy max-w-2xl">
          {t("differentiators.title")}
        </h2>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-hairline border border-hairline">
          {DIFF_FIELDS.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.05,
              }}
              className="bg-white p-6"
            >
              <p className="eyebrow">{t(`labels.${f.labelKey}`)}</p>
              <p className="mt-4 font-serif text-lg text-navy leading-snug">
                {differentiators[f.key]}
              </p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}

function ProductCard({
  product: p,
  index: i,
}: {
  product: Product;
  index: number;
}) {
  const t = useTranslations("prodotto");
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: i * 0.04,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col bg-white transition-shadow duration-200 hover:shadow-elev"
    >
      <div className="relative aspect-[4/5] w-full bg-[#F5F3EE] overflow-hidden">
        {p.image ? (
          <motion.div
            animate={{ scale: hovered ? 1.03 : 1 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <Image
              src={p.image}
              alt={p.name}
              width={400}
              height={500}
              priority={i < 4}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="w-auto h-auto max-w-full max-h-full object-contain"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] uppercase tracking-micro text-carbon-muted">
              {t("mockupPlaceholder")}
            </p>
          </div>
        )}
      </div>

      <div className="relative flex flex-col flex-1 p-8">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[11px] text-carbon-muted tracking-tight">
            {p.sku}
          </p>
          <p className="eyebrow text-gold">{p.category}</p>
        </div>

        <h3 className="mt-6 font-serif text-2xl text-navy leading-tight">
          {p.name}
        </h3>
        <p className="mt-2 text-sm text-carbon-muted num">{p.format}</p>

        <div className="mt-8 hairline pt-6 grid grid-cols-3 gap-4 num">
          <Stat label={t("labels.price")} value={formatCurrency(p.price_usa)} />
          <Stat
            label={t("labels.cost")}
            value={`€${p.transfer_eu.toFixed(2)}`}
          />
          <Stat
            label={t("labels.margin")}
            value={`${p.margin_pct}%`}
            accent
          />
        </div>

        <p className="mt-auto pt-8 text-xs text-carbon-muted leading-relaxed">
          {p.key_usp}
        </p>

        <span className="absolute left-8 bottom-8 h-px w-6 bg-gold group-hover:w-16 transition-[width] duration-500" />
      </div>
    </motion.article>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-micro text-carbon-muted">
        {label}
      </p>
      <p
        className={
          accent
            ? "mt-1 font-serif text-xl text-gold"
            : "mt-1 font-serif text-xl text-navy"
        }
      >
        {value}
      </p>
    </div>
  );
}
