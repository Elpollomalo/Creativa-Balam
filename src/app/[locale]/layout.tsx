import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono, Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat-widget";
import { Particles } from "@/components/particles";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * 'resizes-content': el navegador achica de verdad el viewport (layout +
 * visual) cuando aparece el teclado, en vez de solo superponerlo encima del
 * contenido (default 'resizes-visual'). Sin esto, el ChatWidget (fixed
 * bottom-0) a veces se expandía "detrás" del teclado -- intermitente porque
 * dependía de si el navegador alcanzaba a achicar el layout viewport a
 * tiempo o no. Mismo fix aplicado en tourbrain-app el 26 julio 2026.
 */
export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${plexMono.variable} ${geist.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <Particles count={44} />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <SiteFooter />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
