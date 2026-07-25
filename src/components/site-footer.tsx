import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="pb-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="font-mono text-xs text-muted-foreground">
            {t("tagline")}
          </p>
        </div>

        <div className="space-y-1.5 font-mono text-xs text-muted-foreground sm:text-right">
          <p className="text-foreground/70">{t("contact")}</p>
          <a
            href="tel:+529871123961"
            className="block transition-colors hover:text-terminal-green"
          >
            {t("phone")}
          </a>
          <a
            href="mailto:balamcozu@proton.me"
            className="block transition-colors hover:text-terminal-green"
          >
            {t("email")}
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-4 font-mono text-[11px] text-muted-foreground sm:px-6">
        <span>
          © {year} balam — {t("rights")}
        </span>
      </div>
    </footer>
  );
}
