"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/animated-section";
import products from "@/data/products.json";
import { formatCurrency } from "@/lib/utils";

export default function ProdottoPage() {
  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">02 · Prodotto</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          Otto SKU selezionati per aprire il mercato con margini tra 41% e 47%.
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          L'assortimento è costruito per coprire il percorso del pet owner
          premium: dry food flagship, umido mediterraneo, snack, chew,
          integratori, grooming e accessori heritage.
        </p>
      </AnimatedSection>

      <section className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
        {products.map((p, i) => (
          <motion.article
            key={p.sku}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.04,
            }}
            className="group relative bg-white p-8 transition-shadow duration-500 hover:shadow-elev"
          >
            <div className="flex items-baseline justify-between">
              <p className="eyebrow num">{p.sku}</p>
              <p className="eyebrow text-gold">{p.category}</p>
            </div>
            <h3 className="mt-6 font-serif text-2xl text-navy leading-tight">
              {p.name}
            </h3>
            <p className="mt-2 text-sm text-carbon-muted">{p.format}</p>

            <div className="mt-8 hairline pt-6 grid grid-cols-3 gap-4 num">
              <Stat label="Prezzo" value={formatCurrency(p.price)} />
              <Stat label="Costo" value={formatCurrency(p.cost)} />
              <Stat label="Margine" value={`${p.margin}%`} accent />
            </div>

            <p className="mt-6 text-sm text-carbon-muted leading-relaxed">
              {p.positioning}
            </p>
            <span className="absolute left-8 bottom-8 h-px w-6 bg-gold group-hover:w-16 transition-[width] duration-500" />
          </motion.article>
        ))}
      </section>

      <AnimatedSection className="mt-24 max-w-3xl">
        <p className="eyebrow">Logica di assortimento</p>
        <h2 className="mt-3 font-serif text-hero text-navy">
          Un range compatto, ad alta marginalità, facilmente esponibile in
          200 ft² di scaffale.
        </h2>
        <p className="mt-6 text-carbon-muted leading-relaxed">
          Gli SKU sono stati selezionati privilegiando rotazione attesa,
          riconoscibilità italiana e margine minimo 40%. Ogni referenza ha un
          ruolo preciso nel cross-sell e nella storia di marca.
        </p>
      </AnimatedSection>
    </div>
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
