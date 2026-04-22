"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="mt-32 border-t border-hairline">
      <div className="container py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-sm text-carbon-muted">{t("confidential")}</p>
        <p className="eyebrow text-carbon-muted">{t("version")}</p>
      </div>
    </footer>
  );
}
