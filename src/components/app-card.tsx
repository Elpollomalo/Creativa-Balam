"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TerminalWindow } from "@/components/terminal-window";
import type { AppEntry } from "@/lib/apps-data";
import { cn } from "@/lib/utils";

export function AppCard({ app }: { app: AppEntry }) {
  const t = useTranslations("apps");
  const isLive = app.status === "live";

  const badge = (
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
  );

  const stackTags = (
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
  );

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            className="group relative w-full overflow-hidden rounded-lg border border-border bg-card/60 p-6 text-left transition-colors hover:border-terminal-green/40"
          />
        }
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-lg font-medium text-foreground">
            {t(`items.${app.slug}.name`)}
          </h3>
          {badge}
        </div>

        <p className="mb-3 text-sm text-foreground/80">
          {t(`items.${app.slug}.tagline`)}
        </p>
        <p className="mb-5 font-mono text-xs leading-relaxed text-muted-foreground">
          {t(`items.${app.slug}.detail`)}
        </p>

        {stackTags}
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 border-0 bg-transparent p-0 sm:max-w-sm"
      >
        {/* SheetTitle solo para lectores de pantalla -- el título visible vive en la barra de la TerminalWindow */}
        <SheetHeader className="sr-only">
          <SheetTitle>{t(`items.${app.slug}.name`)}</SheetTitle>
        </SheetHeader>

        <TerminalWindow
          title={`~/proyectos/${app.slug}`}
          className="h-full rounded-none border-0 border-l bg-background/95"
        >
          <div className="flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono text-xl font-medium text-foreground">
                {t(`items.${app.slug}.name`)}
              </h3>
              {badge}
            </div>

            <p className="mb-3 text-sm text-foreground/80">
              {t(`items.${app.slug}.tagline`)}
            </p>
            <p className="mb-5 text-xs leading-relaxed text-muted-foreground">
              {t(`items.${app.slug}.detail`)}
            </p>

            <div className="mb-6">{stackTags}</div>

            <Separator className="mb-6" />

            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-terminal-green/40 px-3 py-1.5 text-xs text-terminal-green transition-colors hover:bg-terminal-green/10"
            >
              {t("visitSite")}
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </TerminalWindow>
      </SheetContent>
    </Sheet>
  );
}
