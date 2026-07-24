"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const locales = ["es", "en"] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex items-center gap-1 font-mono text-xs text-muted-foreground",
        className,
      )}
    >
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          <Link
            href={pathname}
            locale={locale}
            className={cn(
              "rounded px-1.5 py-1 uppercase transition-colors hover:text-terminal-green",
              activeLocale === locale && "text-terminal-green",
            )}
            aria-current={activeLocale === locale}
          >
            {locale}
          </Link>
          {i < locales.length - 1 && <span className="text-border">/</span>}
        </span>
      ))}
    </div>
  );
}
