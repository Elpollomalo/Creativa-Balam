// Slugs neutros en ambos idiomas: evita duplicar rutas traducidas con `pathnames`.
export const SERVICIOS = ["software-a-medida", "sistemas-de-reservas", "automatizaciones"] as const;

export type ServicioSlug = (typeof SERVICIOS)[number];

export function esServicio(slug: string): slug is ServicioSlug {
  return (SERVICIOS as readonly string[]).includes(slug);
}

type Imagen = { src: string; ancho: number; alto: number };

type Visual = {
  // Imagen del encabezado. "montaje" y "celular" flotan sobre el fondo (PNG con
  // transparencia); "tarjeta" lleva su propio fondo.
  hero: Imagen & { tipo: "montaje" | "celular" | "tarjeta"; pie?: string };
  caso: { nombre: string; url: string; dominio: string; captura?: Imagen };
};

// Los nombres de proyecto son los que ya se publican en el portafolio del inicio.
export const VISUALES: Record<ServicioSlug, Visual> = {
  "software-a-medida": {
    hero: { src: "/servicios/montaje.webp", ancho: 1295, alto: 951, tipo: "montaje" },
    caso: {
      nombre: "Galería Azul",
      url: "https://cozumelglassart.com",
      dominio: "cozumelglassart.com",
      captura: { src: "/servicios/galeria-azul.webp", ancho: 1280, alto: 800 },
    },
  },
  "sistemas-de-reservas": {
    hero: { src: "/servicios/blue-reef.webp", ancho: 1100, alto: 825, tipo: "tarjeta", pie: "Blue Reef Divers" },
    caso: {
      nombre: "CozuTours",
      url: "https://www.cozutours.com",
      dominio: "cozutours.com",
      captura: { src: "/servicios/cozutours.webp", ancho: 1280, alto: 800 },
    },
  },
  automatizaciones: {
    hero: { src: "/servicios/tourbrain-celular.webp", ancho: 738, alto: 1355, tipo: "celular", pie: "TourBrain" },
    caso: { nombre: "TourBrain", url: "https://www.tourbrain.online", dominio: "tourbrain.online" },
  },
};
