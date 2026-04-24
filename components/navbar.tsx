"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_ITEMS: Array<{ href: string; key: string }> = [
  { href: "/", key: "cockpit" },
  { href: "/mercato", key: "mercato" },
  { href: "/prodotto", key: "prodotto" },
  { href: "/operativo", key: "operativo" },
  { href: "/governance", key: "governance" },
  { href: "/finanziario", key: "finanziario" },
  { href: "/clienti", key: "clienti" },
  { href: "/roadmap", key: "roadmap" },
  { href: "/rischi", key: "rischi" },
  { href: "/allegati", key: "allegati" },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const padding = useTransform(scrollY, [0, 120], ["1.25rem", "0.6rem"]);

  // Close drawer on route/locale change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, locale]);

  // Body scroll lock while drawer is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // ESC key closes drawer
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <motion.header
        style={{ paddingTop: padding, paddingBottom: padding }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-[background,backdrop-filter,border-color] duration-300",
          scrolled || menuOpen
            ? "bg-white/85 backdrop-blur-md border-b border-hairline"
            : "bg-white/0 border-b border-transparent"
        )}
      >
        <div className="container flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <span className="block h-2 w-2 rounded-full bg-gold" />
            <span className="font-serif text-navy text-base sm:text-lg tracking-tight">
              Diusapet <span className="text-carbon-muted">USA</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm tracking-tight transition-colors",
                    active ? "text-navy" : "text-carbon-muted hover:text-navy"
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

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            className="lg:hidden inline-flex items-center justify-center h-11 w-11 -mr-2 text-navy"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="x"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.18, ease }}
                  className="inline-flex"
                >
                  <X className="h-6 w-6" strokeWidth={1.6} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.18, ease }}
                  className="inline-flex"
                >
                  <Menu className="h-6 w-6" strokeWidth={1.6} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <MobileDrawer
            key="drawer"
            pathname={pathname}
            locale={locale}
            onClose={() => setMenuOpen(false)}
            t={t}
            tCommon={tCommon}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function MobileDrawer({
  pathname,
  locale,
  onClose,
  t,
  tCommon,
}: {
  pathname: string;
  locale: string;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="lg:hidden fixed inset-0 z-[55] bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <motion.aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t("openMenu")}
        className="lg:hidden fixed top-0 right-0 z-[60] h-[100dvh] w-[88vw] max-w-[360px] bg-white flex flex-col shadow-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-hairline">
          <span className="font-serif text-navy text-lg tracking-tight">
            Diusapet <span className="text-carbon-muted">USA</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeMenu")}
            className="inline-flex items-center justify-center h-11 w-11 -mr-2 text-navy"
          >
            <X className="h-6 w-6" strokeWidth={1.6} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 divide-y divide-hairline">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="relative flex items-center py-4"
              >
                <span
                  className={cn(
                    "font-serif text-2xl tracking-tight transition-colors",
                    active ? "text-navy" : "text-carbon-muted"
                  )}
                >
                  {t(item.key)}
                </span>
                {active && (
                  <span className="absolute left-0 bottom-3 h-px w-8 bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-hairline px-6 py-5 flex items-center justify-between gap-4">
          <LanguageSwitcher
            current={locale}
            pathname={pathname}
            onNavigate={onClose}
          />
          <span className="eyebrow text-carbon-muted">
            {tCommon("confidential")}
          </span>
        </div>
      </motion.aside>
    </>
  );
}

function LanguageSwitcher({
  current,
  pathname,
  onNavigate,
}: {
  current: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Link
        href={pathname}
        locale="it"
        onClick={onNavigate}
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
        onClick={onNavigate}
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
