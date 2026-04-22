"use client";

import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import attachments from "@/data/attachments.json";

export default function AllegatiPage() {
  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">08 · Allegati</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          Tredici documenti a supporto del business case.
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          Executive summary, studio di mercato, listino, P&L dettagliato,
          CRM prospect, compliance checklist e deck investor. Download
          disponibile dopo il wiring del bucket.
        </p>
      </AnimatedSection>

      <AnimatedSection stagger className="mt-16 border border-hairline">
        {attachments.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: i * 0.03 }}
            className="group grid grid-cols-12 items-center gap-4 border-b border-hairline last:border-b-0 bg-white hover:bg-navy/[0.02] transition-colors"
          >
            <div className="col-span-1 p-5 eyebrow num">{a.id}</div>
            <div className="col-span-1 p-5">
              {a.format === "PDF" ? (
                <FileText className="h-4 w-4 text-navy" strokeWidth={1.2} />
              ) : (
                <FileSpreadsheet
                  className="h-4 w-4 text-navy"
                  strokeWidth={1.2}
                />
              )}
            </div>
            <div className="col-span-5 p-5 font-serif text-navy text-lg">
              {a.title}
            </div>
            <div className="col-span-1 p-5 text-xs text-carbon-muted">
              {a.format}
            </div>
            <div className="col-span-1 p-5 text-xs text-carbon-muted num">
              {a.size}
            </div>
            <div className="col-span-1 p-5 text-xs text-carbon-muted num">
              {a.updated}
            </div>
            <div className="col-span-2 p-5 flex justify-end">
              <button
                type="button"
                className="group/btn inline-flex items-center gap-2 text-sm text-navy border-b border-navy/30 hover:border-gold pb-1 transition-colors"
              >
                Scarica
                <Download className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatedSection>

      <p className="mt-8 text-xs text-carbon-muted">
        I file sono placeholder. Il wiring al bucket riservato sarà attivato
        in fase di deploy su usa.diusapet.work.
      </p>
    </div>
  );
}
