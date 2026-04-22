"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_ITEMS: Array<{ href: string; key: string }> = [
  { href: "/", key: "cockpit" },
  { href: "/mercato", key: "mercato" },
  { href: "/prodotto", key: "prodotto" },
  { href: "/operativo", key: "operativo" },
  { href: "/finanziario", key: "finanziario" },
  { href: "/clienti", key: "clienti" },
  { href: "/roadmap", key: "roadmap" },
  { href: "/rischi", key: "rischi" },
  { href: "/allegati", key: "allegati" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

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
          {NAV_ITEMS.map((item) => {
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
                  active
                    ? "text-navy"
                    : "text-carbon-muted hover:text-navy"
                )}
              >
                {t(item.key)}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-px bg-gold"
                    transition={{ duration: 0.35, ease }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher current={locale} pathname={pathname} />
          <span className="eyebrow text-carbon-muted">
            {tCommon("confidential")}
          </span>
        </div>
      </div>
    </motion.header>
  );
}

function LanguageSwitcher({
  current,
  pathname,
}: {
  current: string;
  pathname: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Link
        href={pathname}
        locale="it"
        className={cn(
          "pb-0.5 transition-colors",
          current === "it"
            ? "text-navy border-b-2 border-gold"
            : "text-carbon-muted hover:text-navy"
        )}
      >
        IT
      </Link>
      <span className="text-carbon-muted/60">·</span>
      <Link
        href={pathname}
        locale="en"
        className={cn(
          "pb-0.5 transition-colors",
          current === "en"
            ? "text-navy border-b-2 border-gold"
            : "text-carbon-muted hover:text-navy"
        )}
      >
        EN
      </Link>
    </div>
  );
}
