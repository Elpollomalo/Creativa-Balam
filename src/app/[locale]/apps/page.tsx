import { setRequestLocale, getTranslations } from "next-intl/server";
import { AppCard } from "@/components/app-card";
import { GridBackground } from "@/components/grid-background";
import { OpenChatButton } from "@/components/open-chat-button";
import { apps } from "@/lib/apps-data";

export default async function AppsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("apps");
  const hero = await getTranslations("hero");

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <GridBackground />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mb-3 font-mono text-xs tracking-widest text-terminal-green/80">
            {`// ${t("eyebrow")}`}
          </p>
          <h1 className="text-3xl font-medium text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">{t("sub")}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {apps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 rounded-lg border border-border bg-card/40 px-6 py-10 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              {t("footerNote")}
            </p>
            <OpenChatButton className="bg-terminal-green font-mono text-background hover:bg-terminal-green/90">
              {hero("ctaPrimary")}
            </OpenChatButton>
          </div>
        </div>
      </section>
    </div>
  );
}
