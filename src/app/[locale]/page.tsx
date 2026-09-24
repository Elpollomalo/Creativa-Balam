import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { OpenChatButton } from "@/components/open-chat-button";
import { GridBackground } from "@/components/grid-background";
import { AppCard } from "@/components/app-card";
import { apps } from "@/lib/apps-data";

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
            {/* En celular se parte después del "//" (así lo escribió Carlos);
                si no, el renglón se cortaba en "Q. / Roo.". */}
            {hero("eyebrow").split(" // ").map((parte, i) => (
              <span key={i}>
                {i > 0 && (
                  <>
                    {" "}
                    <br className="sm:hidden" />
                  </>
                )}
                {i === 0 ? `${parte} //` : parte}
              </span>
            ))}
          </p>
          <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {hero("line1")}
            <br />
            {/* /90 en vez del verde puro: Carlos lo sintió muy brilloso y
                chillón (24 sep 2026) — combinado con el glow ya bajado en
                globals.css. */}
            <span className="text-glow text-terminal-green/90">
              {hero("line2")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
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
              href="/#portafolio"
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

      {/* Portafolio: vive aquí mismo, con ancla. Antes había una página /apps
          aparte que repetía exactamente esta sección; Carlos pidió dejar solo
          el scroll (24 sep 2026) y /apps ahora redirige a este ancla. */}
      <section id="portafolio" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10">
            <p className="mb-2 font-mono text-xs tracking-widest text-muted-foreground">
              {`// ${appsT("eyebrow")}`}
            </p>
            <h2 className="text-2xl font-medium text-foreground sm:text-3xl">
              {appsT("title")}
            </h2>
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
