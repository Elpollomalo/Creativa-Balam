"use client";

import { usePathname } from "@/i18n/navigation";

/**
 * Páginas de campaña: llevan su propio encabezado y pie, sin la terminal
 * (chat), la barra de navegación del sitio ni las partículas. Una página de
 * anuncios debe tener una sola salida clara (WhatsApp o el formulario), y la
 * terminal del estudio es justo la distracción que no queremos ahí.
 */
const PAGINAS_DE_CAMPANA = ["/paginas-web-cozumel"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const esCampana = PAGINAS_DE_CAMPANA.some(
    (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`),
  );
  if (esCampana) return null;
  return <>{children}</>;
}
