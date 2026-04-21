"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Cockpit" },
  { href: "/mercato", label: "Mercato" },
  { href: "/prodotto", label: "Prodotto" },
  { href: "/modello-operativo", label: "Operativo" },
  { href: "/piano-finanziario", label: "Finanziario" },
  { href: "/clienti", label: "Clienti" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/rischi", label: "Rischi" },
  { href: "/allegati", label: "Allegati" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const padding = useTransform(scrollY, [0, 120], ["1.25rem", "0.6rem"]);

  return (
    <motion.header
      style={{ paddingTop: padding, paddingBottom: padding }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-[background,backdrop-filter,border-color] duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-hairline"
          : "bg-white/0 border-b border-transparent"
      )}
    >
      <div className="container flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="block h-2 w-2 rounded-full bg-gold" />
          <span className="font-serif text-navy text-lg tracking-tight">
            Diusapet <span className="text-carbon-muted">USA</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm tracking-tight transition-colors",
                  active ? "text-navy" : "text-carbon-muted hover:text-navy"
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-px bg-gold"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block eyebrow text-carbon-muted">
          Riservato
        </div>
      </div>
    </motion.header>
  );
}
