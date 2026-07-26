export type AppStatus = "live" | "progress";

export type AppEntry = {
  slug: "tourbrain" | "gnga" | "ponexo" | "tourquesa";
  status: AppStatus;
  stack: string[];
  url: string;
};

export const apps: AppEntry[] = [
  {
    slug: "tourbrain",
    status: "live",
    stack: ["Next.js", "Supabase", "Stripe"],
    url: "https://tourbrain-app.vercel.app",
  },
  {
    slug: "gnga",
    status: "progress",
    stack: ["n8n", "Dify", "Telegram"],
    url: "https://gnga.tech",
  },
  {
    slug: "ponexo",
    status: "live",
    stack: ["Next.js", "Supabase", "n8n"],
    url: "https://diagnostico.creativabalam.com.mx",
  },
  {
    slug: "tourquesa",
    status: "progress",
    stack: ["Next.js", "Supabase", "Stripe"],
    url: "https://tourquesa.vercel.app",
  },
];
