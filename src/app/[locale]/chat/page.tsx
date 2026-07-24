import { setRequestLocale, getTranslations } from "next-intl/server";
import { GridBackground } from "@/components/grid-background";
import { ChatPanel } from "@/components/chat-panel";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("chat");

  return (
    <section className="relative flex flex-1 flex-col overflow-hidden">
      <GridBackground />
      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-14 sm:px-6">
        <p className="mb-3 font-mono text-xs tracking-widest text-terminal-green/80">
          {`// ${t("eyebrow")}`}
        </p>
        <h1 className="mb-2 text-3xl font-medium text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">{t("sub")}</p>

        <ChatPanel />
      </div>
    </section>
  );
}
