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

        {/* `py-2 -my-2` da a cada enlace los 24px de alto táctil que pide
            WCAG, sin mover nada visualmente: el padding crece el área que se
            puede tocar y el margen negativo la reabsorbe en el layout. El
            teléfono y el correo eran los objetivos que Lighthouse marcaba
            como demasiado pequeños (accesibilidad 84, 1 ago 2026). */}
        <div className="space-y-1.5 font-mono text-xs text-muted-foreground sm:text-right">
          <p className="text-foreground/70">{t("contact")}</p>
          <a
            href="tel:+529871123961"
            className="block -my-2 py-2 transition-colors hover:text-terminal-green"
          >
            {t("phone")}
          </a>
          <a
            href="mailto:hola@creativabalam.com.mx"
            className="block -my-2 py-2 transition-colors hover:text-terminal-green"
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
