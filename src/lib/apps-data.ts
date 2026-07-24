export type AppStatus = "live" | "progress";

export type AppEntry = {
  slug: "tourbrain" | "gnga";
  status: AppStatus;
  stack: string[];
};

export const apps: AppEntry[] = [
  {
    slug: "tourbrain",
    status: "live",
    stack: ["Next.js", "Supabase", "Stripe"],
  },
  {
    slug: "gnga",
    status: "progress",
    stack: ["n8n", "Dify", "Telegram"],
  },
];
