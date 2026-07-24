import { cn } from "@/lib/utils";

export function TerminalWindow({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card/80 backdrop-blur-sm glow-border",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="p-4 sm:p-6 font-mono text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
