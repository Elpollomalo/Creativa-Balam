"use client";

import { usePathname } from "@/i18n/navigation";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat-widget";

// El diagnóstico de marketing es una herramienta con identidad visual y
// selector de idioma propios (independiente del next-intl del resto del
// sitio) — no lleva el chrome oscuro/terminal.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = pathname.startsWith("/diagnostico");

  if (isStandalone) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <SiteFooter />
      <ChatWidget />
    </>
  );
}
