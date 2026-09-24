import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

/**
 * /apps ya no es una página: repetía exactamente el portafolio de la home.
 * Carlos, 24 sep 2026: "sería mejor solo un scroll en la página principal".
 * Se deja la ruta redirigiendo al ancla para no romper enlaces viejos ni lo
 * que Google ya tiene indexado.
 */
export default async function AppsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: "/#portafolio", locale });
}
