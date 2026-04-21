# Diusapet USA — Strategic Business Case

Sito interno corporate per l'espansione USA di Diusapet S.r.l.
Riservato — uso interno.

## Stack

- Next.js 14 · App Router · TypeScript
- Tailwind CSS + shadcn/ui convention (Radix primitives)
- Framer Motion · Lenis smooth scroll · react-intersection-observer
- Recharts · lucide-react
- IBM Plex Sans + IBM Plex Serif

## Setup

```bash
npm install
npm run dev
```

L'app è servita su [http://localhost:3000](http://localhost:3000).

## Struttura

- `app/` — route App Router (9 pagine)
- `components/` — componenti riutilizzabili (Navbar, KPICard, AnimatedSection, ScenarioSimulator, PipelineFunnel, Timeline, RiskMatrix, PageTransition, SmoothScrollProvider, Footer)
- `data/` — sorgenti JSON (KPI, mercato, prodotti, finanziari, clienti, roadmap, rischi, allegati, modello operativo)
- `lib/utils.ts` — utility di formato
- `vercel.json` — config deploy per `usa.diusapet.work`

## Palette

- Navy `#0B1E3F` · Carbon `#1A1A1A` · White · Gold `#B8925A`
