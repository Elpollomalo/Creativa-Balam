import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { OpenChatButton } from "@/components/open-chat-button";
import { GridBackground } from "@/components/grid-background";
import { AppCard } from "@/components/app-card";
import { apps } from "@/lib/apps-data";
import { ArrowRight } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const hero = await getTranslations("hero");
  const principles = await getTranslations("principles");
  const appsT = await getTranslations("apps");

  const principleItems = [0, 1, 2].map((i) => ({
    title: principles(`items.${i}.title`),
    body: principles(`items.${i}.body`),
  }));

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <GridBackground />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-32">
          <p className="mb-5 font-mono text-xs tracking-widest text-terminal-green/80">
            {hero("eyebrow")}
          </p>
          <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {hero("line1")}
            <br />
            <span className="text-glow text-terminal-green">
              {hero("line2")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            {hero("sub")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <OpenChatButton
              size="lg"
              className="bg-terminal-green font-mono text-background hover:bg-terminal-green/90"
            >
              {hero("ctaPrimary")}
            </OpenChatButton>
            <Link
              href="/apps"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className:
                  "border-border font-mono text-foreground hover:border-terminal-cyan/50 hover:text-terminal-cyan",
              })}
            >
              {hero("ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="mb-10 font-mono text-sm tracking-widest text-muted-foreground">
            {`// ${principles("title")}`}
          </h2>
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {principleItems.map((item) => (
              <div key={item.title}>
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

      {/* Apps preview */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-xs tracking-widest text-muted-foreground">
                {`// ${appsT("eyebrow")}`}
              </p>
              <h2 className="text-2xl font-medium text-foreground sm:text-3xl">
                {appsT("title")}
              </h2>
            </div>
            <Link
              href="/apps"
              className="hidden items-center gap-1 font-mono text-sm text-muted-foreground transition-colors hover:text-terminal-green sm:flex"
            >
              {appsT("viewAll")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {apps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
