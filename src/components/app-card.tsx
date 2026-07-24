import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { AppEntry } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

export function AppCard({ app }: { app: AppEntry }) {
  const t = useTranslations("apps");

  const isLive = app.status === "live";

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card/60 p-6 transition-colors hover:border-terminal-green/40">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-lg font-medium text-foreground">
          {t(`items.${app.slug}.name`)}
        </h3>
        <Badge
          variant="outline"
          className={cn(
            "border font-mono text-[10px] tracking-wide",
            isLive
              ? "border-terminal-green/40 text-terminal-green"
              : "border-terminal-cyan/40 text-terminal-cyan",
          )}
        >
          <span
            className={cn(
              "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
              isLive ? "bg-terminal-green" : "bg-terminal-cyan",
            )}
          />
          {isLive ? t("statusLive") : t("statusProgress")}
        </Badge>
      </div>

      <p className="mb-3 text-sm text-foreground/80">
        {t(`items.${app.slug}.tagline`)}
      </p>
      <p className="mb-5 font-mono text-xs leading-relaxed text-muted-foreground">
        {t(`items.${app.slug}.detail`)}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {app.stack.map((tech) => (
          <span
            key={tech}
            className="rounded border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
