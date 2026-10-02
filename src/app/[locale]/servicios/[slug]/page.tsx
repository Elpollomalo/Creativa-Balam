import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { OpenChatButton } from "@/components/open-chat-button";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { GridBackground } from "@/components/grid-background";
import { TerminalWindow } from "@/components/terminal-window";
import { SITE_URL } from "@/lib/site";
import { SERVICIOS, esServicio } from "@/lib/servicios";

type Params = { locale: string; slug: string };
type Item = { title: string; body: string };
type Faq = { q: string; a: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICIOS.map((slug) => ({ locale, slug })),
  );
}

function rutaDe(locale: string, slug: string) {
  return locale === routing.defaultLocale
    ? `/servicios/${slug}`
    : `/${locale}/servicios/${slug}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!esServicio(slug)) return {};
  const t = await getTranslations({ locale, namespace: "services.items" });
  const title = t(`${slug}.metaTitle`);
  const description = t(`${slug}.metaDescription`);
  return {
    title,
    description,
    alternates: {
      canonical: rutaDe(locale, slug),
      languages: {
        es: rutaDe("es", slug),
        en: rutaDe("en", slug),
        "x-default": rutaDe("es", slug),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Creativa Balam",
      title,
      description,
      url: rutaDe(locale, slug),
      locale: locale === "es" ? "es_MX" : "en_US",
    },
  };
}

export default async function ServicioPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  if (!esServicio(slug)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "services" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const includes = t.raw(`items.${slug}.includes`) as Item[];
  const faq = t.raw(`items.${slug}.faq`) as Faq[];
  const proceso = t.raw("common.process") as Item[];
  const otros = SERVICIOS.filter((s) => s !== slug);
  const nombre = t(`items.${slug}.name`);
  const url = `${SITE_URL}${rutaDe(locale, slug)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: t(`items.${slug}.h1`),
      serviceType: nombre,
      description: t(`items.${slug}.metaDescription`),
      url,
      inLanguage: locale,
      areaServed: { "@type": "Country", name: "México" },
      provider: {
        "@type": "Organization",
        name: "Creativa Balam",
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("common.breadcrumbHome"),
          item: locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: t(`items.${slug}.name`),
          item: url,
        },
      ],
    },
  ];

  const textoWhatsApp = t("common.whatsappText", { servicio: nombre });

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <GridBackground />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
          <nav
            aria-label="breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-terminal-green">
              {t("common.breadcrumbHome")}
            </Link>
            <span aria-hidden>/</span>
            <Link href="/#servicios" className="transition-colors hover:text-terminal-green">
              {t("common.breadcrumbServices")}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground/80">{nombre}</span>
          </nav>

          <p className="mb-5 font-mono text-xs tracking-widest text-terminal-green/80">
            {`// ${t("common.eyebrow")}`}
          </p>
          <h1 className="text-3xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-5xl">
            {t(`items.${slug}.h1`)}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t(`items.${slug}.lead`)}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <OpenChatButton
              size="lg"
              className="bg-terminal-green font-mono text-background hover:bg-terminal-green/90"
            >
              {t("common.ctaChat")}
            </OpenChatButton>
            <WhatsAppLink
              zona={`servicio_${slug}_hero`}
              texto={textoWhatsApp}
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className:
                  "border-border font-mono text-foreground hover:border-terminal-cyan/50 hover:text-terminal-cyan",
              })}
            >
              {t("common.ctaWhatsapp")}
            </WhatsAppLink>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mb-2 font-mono text-xs tracking-widest text-muted-foreground">
            {`// ${t("common.includesEyebrow")}`}
          </p>
          <h2 className="mb-10 max-w-2xl text-2xl font-medium text-foreground sm:text-3xl">
            {t(`items.${slug}.includesTitle`)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {includes.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-border bg-card/60 p-6 transition-colors hover:border-terminal-green/40"
              >
                <h3 className="mb-2 font-mono text-sm text-terminal-green">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mb-2 font-mono text-xs tracking-widest text-muted-foreground">
            {`// ${t("common.processEyebrow")}`}
          </p>
          <h2 className="mb-10 max-w-2xl text-2xl font-medium text-foreground sm:text-3xl">
            {t("common.processTitle")}
          </h2>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {proceso.map((paso, i) => (
              <li key={paso.title} className="relative">
                <span className="mb-3 block font-mono text-3xl font-medium text-terminal-cyan/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2 font-mono text-sm text-foreground">
                  {paso.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {paso.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Un caso */}
      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mb-2 font-mono text-xs tracking-widest text-muted-foreground">
            {`// ${t("common.caseEyebrow")}`}
          </p>
          <h2 className="mb-8 text-2xl font-medium text-foreground sm:text-3xl">
            {t(`items.${slug}.case.client`)}
          </h2>
          <TerminalWindow title={`~/casos/${slug}`}>
            <div className="space-y-6">
              <div>
                <p className="mb-1.5 text-xs text-terminal-green">
                  {`$ ${t("common.caseBuilt")}`}
                </p>
                <p className="font-sans text-sm leading-relaxed text-foreground/85 sm:text-base">
                  {t(`items.${slug}.case.built`)}
                </p>
              </div>
              <div>
                <p className="mb-1.5 text-xs text-terminal-cyan">
                  {`$ ${t("common.caseToday")}`}
                </p>
                <p className="font-sans text-sm leading-relaxed text-foreground/85 sm:text-base">
                  {t(`items.${slug}.case.today`)}
                </p>
              </div>
            </div>
          </TerminalWindow>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mb-2 font-mono text-xs tracking-widest text-muted-foreground">
            {`// ${t("common.faqEyebrow")}`}
          </p>
          <h2 className="mb-8 text-2xl font-medium text-foreground sm:text-3xl">
            {t("common.faqTitle")}
          </h2>
          <div className="divide-y divide-border rounded-lg border border-border bg-card/40">
            {faq.map((f) => (
              <details key={f.q} className="group px-5 py-4 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium text-foreground transition-colors hover:text-terminal-green sm:text-base [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="shrink-0 font-mono text-lg leading-none text-terminal-green transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Otros servicios */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mb-8 font-mono text-xs tracking-widest text-muted-foreground">
            {`// ${t("common.othersEyebrow")}`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {otros.map((otro) => (
              <Link
                key={otro}
                href={`/servicios/${otro}`}
                className="group rounded-lg border border-border bg-card/60 p-6 transition-colors hover:border-terminal-green/40"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-mono text-lg font-medium text-foreground">
                    {t(`items.${otro}.name`)}
                  </h3>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-terminal-green" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${otro}.short`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="relative overflow-hidden border-t border-border">
        <GridBackground />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <h2 className="text-2xl font-medium text-foreground sm:text-4xl">
            {t("common.finalTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t("common.finalBody")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <OpenChatButton
              size="lg"
              className="bg-terminal-green font-mono text-background hover:bg-terminal-green/90"
            >
              {nav("cta")}
            </OpenChatButton>
            <WhatsAppLink
              zona={`servicio_${slug}_cierre`}
              texto={textoWhatsApp}
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className:
                  "border-border font-mono text-foreground hover:border-terminal-cyan/50 hover:text-terminal-cyan",
              })}
            >
              {t("common.ctaWhatsapp")}
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </div>
  );
}
