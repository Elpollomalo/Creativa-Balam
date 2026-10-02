"use client";

import { track } from "@/lib/track";
import { whatsappUrl } from "@/lib/site";

/**
 * Enlace a WhatsApp que además registra el clic como evento de GA4
 * (`whatsapp_click`), con la zona de la página desde donde se tocó.
 */
export function WhatsAppLink({
  zona,
  texto,
  className,
  children,
}: {
  zona: string;
  texto: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={whatsappUrl(texto)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { zona })}
      className={className}
    >
      {children}
    </a>
  );
}
