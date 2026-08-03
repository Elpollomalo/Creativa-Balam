/**
 * Orden y estado de los proyectos del portafolio.
 *
 * El ORDEN de este arreglo es el que se muestra en la home y en /apps (las dos
 * páginas lo recorren tal cual) — lo definió Carlos el 29 julio 2026:
 * Tourquesa, TourBrain, Ponexo, GNGA.Web3. El 2 agosto 2026 Carlos agregó
 * Blue Reef Divers debajo de TourBrain.
 *
 * Tres estados, no dos (antes solo había "live" y "progress"):
 *  - `online`      → ya está en línea y cualquiera puede entrar.
 *  - `produccion`  → operando de verdad en producción.
 *  - `desarrollo`  → todavía en construcción.
 */
export type AppStatus = "online" | "produccion" | "desarrollo";

export type AppEntry = {
  slug: "tourbrain" | "bluereef" | "gnga" | "ponexo" | "tourquesa";
  status: AppStatus;
  stack: string[];
  url: string;
};

export const apps: AppEntry[] = [
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
  {
    slug: "ponexo",
    status: "produccion",
    stack: ["Next.js", "Supabase", "n8n"],
    url: "https://diagnostico.creativabalam.com.mx",
  },
  {
    slug: "gnga",
    status: "desarrollo",
    stack: ["n8n", "Dify", "Telegram"],
    url: "https://gnga.tech",
  },
];
