"use client";

import { AnimatedSection } from "@/components/animated-section";
import { RiskMatrix } from "@/components/risk-matrix";
import risks from "@/data/risks.json";

export default function RischiPage() {
  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">07 · Rischi</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          Otto aree di rischio mappate, ognuna con una mitigazione operativa
          già definita.
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          La matrice valuta probabilità e impatto su ogni rischio identificato
          nel percorso di ingresso. Il focus è sulle azioni concrete, non
          sugli impact assessment astratti.
        </p>
      </AnimatedSection>

      <div className="mt-16">
        <RiskMatrix risks={risks} />
      </div>

      <AnimatedSection stagger className="mt-16 grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
        {[
          {
            k: "$2M",
            l: "Product liability coverage",
            d: "Polizza assicurativa attivata prima del primo shipment.",
          },
          {
            k: "60 gg",
            l: "Stock di sicurezza in 3PL NJ",
            d: "Buffer sulle SKU flagship contro ritardi doganali.",
          },
          {
            k: "6 sett.",
            l: "Buffer FDA/AAFCO",
            d: "Allungamento preventivo sul go-to-market per compliance.",
          },
        ].map((b) => (
          <div key={b.l} className="bg-white p-8">
            <p className="font-serif text-4xl text-navy num">{b.k}</p>
            <p className="mt-3 eyebrow">{b.l}</p>
            <p className="mt-3 text-sm text-carbon-muted leading-relaxed">
              {b.d}
            </p>
          </div>
        ))}
      </AnimatedSection>
    </div>
  );
}
