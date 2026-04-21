"use client";

import { AnimatedSection } from "@/components/animated-section";
import { Timeline } from "@/components/timeline";
import roadmap from "@/data/roadmap.json";

export default function RoadmapPage() {
  const ninety = roadmap.ninetyDays.map((x) => ({
    label: x.week,
    title: x.title,
    detail: x.detail,
  }));
  const milestones = roadmap.milestones.map((x) => ({
    label: x.period,
    title: x.title,
    detail: x.detail,
  }));

  return (
    <div className="container py-8">
      <AnimatedSection>
        <p className="eyebrow text-gold">06 · Roadmap</p>
        <h1 className="mt-6 font-serif text-hero text-navy max-w-3xl">
          Dodici settimane di setup, poi trentasei mesi per arrivare a $510k
          di ricavi.
        </h1>
        <p className="mt-6 max-w-2xl text-carbon-muted leading-relaxed">
          I primi 90 giorni sono una sequenza lineare di setup legale,
          compliance, logistica e primi closing. Da lì la roadmap scala per
          milestone trimestrali.
        </p>
      </AnimatedSection>

      <section className="mt-20 grid lg:grid-cols-2 gap-16">
        <div>
          <p className="eyebrow">Primi 90 giorni</p>
          <h2 className="mt-3 font-serif text-hero text-navy">
            Dall'ingresso al primo reorder.
          </h2>
          <div className="mt-10">
            <Timeline items={ninety} />
          </div>
        </div>

        <div>
          <p className="eyebrow">Milestone 36 mesi</p>
          <h2 className="mt-3 font-serif text-hero text-navy">
            Dalla ripetibilità al break-even.
          </h2>
          <div className="mt-10">
            <Timeline items={milestones} />
          </div>
        </div>
      </section>
    </div>
  );
}
