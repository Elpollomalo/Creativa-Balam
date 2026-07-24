"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OPEN_CHAT_EVENT } from "@/components/chat-widget";
import type { VariantProps } from "class-variance-authority";

type Props = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
};

export function OpenChatButton({ className, size, variant, children }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT))}
      className={cn(buttonVariants({ size, variant, className }))}
    >
      {children}
    </button>
  );
}
