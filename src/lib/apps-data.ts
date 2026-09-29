/**
 * Orden y estado de los proyectos del portafolio.
 *
 * El ORDEN de este arreglo es el que se muestra en el portafolio de la home
 * (lo recorre tal cual) — lo definió Carlos el 29 julio 2026:
 * Tourquesa, TourBrain, Ponexo, GNGA.Web3. El 2 agosto 2026 Carlos agregó
 * Blue Reef Divers debajo de TourBrain. El 24 septiembre 2026 se agregó
 * CozuTours al final, y ese mismo día Carlos pidió subirlo, así que ahora va
 * primero.
 * El 29 septiembre 2026 se agregó Cozumel Glass Art (Galería Azul) y va
 * primero por ser el trabajo más reciente.
 *
 * Tres estados, no dos (antes solo había "live" y "progress"):
 *  - `online`      → ya está en línea y cualquiera puede entrar.
 *  - `produccion`  → operando de verdad en producción.
 *  - `desarrollo`  → todavía en construcción.
 */
export type AppStatus = "online" | "produccion" | "desarrollo";

export type AppEntry = {
  slug: "tourbrain" | "bluereef" | "gnga" | "ponexo" | "tourquesa" | "cozutours" | "cozumelglassart";
  status: AppStatus;
  stack: string[];
  url: string;
};

export const apps: AppEntry[] = [
  {
    slug: "cozumelglassart",
    status: "online",
    stack: ["Next.js", "Supabase", "Resend"],
    url: "https://cozumelglassart.com",
  },
  {
    slug: "cozutours",
    status: "online",
    stack: ["Next.js", "Supabase", "Stripe", "Resend"],
    url: "https://www.cozutours.com",
  },
  {
    slug: "tourquesa",
    status: "online",
    stack: ["Next.js", "Supabase", "Stripe"],
    url: "https://www.tourquesa.com.mx",
  },
  {
    slug: "tourbrain",
    status: "online",
    stack: ["Next.js", "Supabase", "Stripe"],
    url: "https://www.tourbrain.online",
  },
  {
    slug: "bluereef",
    status: "online",
    // Sin Supabase ni Stripe, a diferencia de los otros: la reserva se cierra
    // por WhatsApp o pagando el depósito con PayPal, sin backend propio.
    stack: ["Next.js", "Tailwind", "PayPal"],
    url: "https://www.bluereefdiversmx.com",
  },
  // Ponexo quitado del portafolio "por el momento" (Carlos, 29 sep 2026).
  // Para regresarlo, pegar este bloque donde debe ir en el arreglo (sus textos
  // siguen en messages/*.json):
  //   { slug: "ponexo", status: "produccion",
  //     stack: ["Next.js", "Supabase", "n8n"], url: "https://www.ponexo.work" },
  {
    slug: "gnga",
    status: "desarrollo",
    stack: ["n8n", "Dify", "Telegram"],
    url: "https://gnga.tech",
  },
];
