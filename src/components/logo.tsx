import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-base font-medium tracking-tight text-foreground",
        className,
      )}
    >
      <span className="text-terminal-green">&gt;</span> balam
      <span className="terminal-cursor text-terminal-green">_</span>
    </span>
  );
}
