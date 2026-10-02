import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// "/es" redirige a "/" (idioma por defecto sin prefijo), así que solo se listan
// las URLs que responden directo.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const alternates = {
    languages: { es: SITE_URL, en: `${SITE_URL}/en` },
  };

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1, alternates },
    { url: `${SITE_URL}/en`, lastModified: now, changeFrequency: "monthly", priority: 1, alternates },
    { url: `${SITE_URL}/paginas-web-cozumel`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
