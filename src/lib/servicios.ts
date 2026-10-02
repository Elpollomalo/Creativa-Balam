// Slugs neutros en ambos idiomas: evita duplicar rutas traducidas con `pathnames`.
export const SERVICIOS = ["software-a-medida", "sistemas-de-reservas", "automatizaciones"] as const;

export type ServicioSlug = (typeof SERVICIOS)[number];

export function esServicio(slug: string): slug is ServicioSlug {
  return (SERVICIOS as readonly string[]).includes(slug);
}
