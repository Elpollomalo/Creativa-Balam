import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://creativabalam.com.mx";
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          es: `${base}/es`,
          en: `${base}/en`,
        },
      },
    },
    {
      url: `${base}/es`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/en`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
