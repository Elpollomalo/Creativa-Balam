import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SERVICIOS } from "@/lib/servicios";

// "/es" redirige a "/" (idioma por defecto sin prefijo), así que solo se listan
// las URLs que responden directo.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const alternates = {
    languages: { es: SITE_URL, en: `${SITE_URL}/en` },
  };

  const servicios = SERVICIOS.flatMap((slug) => {
    const es = `${SITE_URL}/servicios/${slug}`;
    const en = `${SITE_URL}/en/servicios/${slug}`;
    const alternates = { languages: { es, en } };
    return [
      { url: es, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9, alternates },
      { url: en, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9, alternates },
    ];
  });

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1, alternates },
    { url: `${SITE_URL}/en`, lastModified: now, changeFrequency: "monthly", priority: 1, alternates },
    { url: `${SITE_URL}/paginas-web-cozumel`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...servicios,
  ];
}
