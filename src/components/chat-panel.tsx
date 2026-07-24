"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TerminalWindow } from "@/components/terminal-window";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  text: string;
};

export function ChatPanel() {
  const t = useTranslations("chat");
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "system", text: t("systemGreeting") },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || pending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPending(true);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
    } catch {
      // stub endpoint — swallow network errors, still show the demo reply
    } finally {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: t("stubReply") },
      ]);
      setPending(false);
    }
  }

  return (
    <TerminalWindow title="balam@chat" className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className="flex max-h-[50vh] min-h-[320px] flex-col gap-4 overflow-y-auto scrollbar-thin pr-1"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "max-w-[85%] rounded-md border px-3.5 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "ml-auto border-terminal-cyan/30 bg-terminal-cyan/5 text-foreground"
                  : "border-terminal-green/25 bg-terminal-green/5 text-foreground/90",
              )}
            >
              <span
                className={cn(
                  "mb-1 block font-mono text-[10px] tracking-wide",
                  m.role === "user"
                    ? "text-terminal-cyan"
                    : "text-terminal-green",
                )}
              >
                {m.role === "user" ? "you" : "balam"}
              </span>
              {m.text}
              {m.id === "greeting" && (
                <span className="mt-2 block font-mono text-xs text-muted-foreground">
                  {t("disclaimer")}
                </span>
              )}
              {m.role === "assistant" && m.id !== "greeting" && (
                <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-terminal-green">
                  <a href="mailto:balamcozu@proton.me" className="hover:underline">
                    balamcozu@proton.me
                  </a>
                  <a href="tel:+529871123961" className="hover:underline">
                    +52 987 112 3961
                  </a>
                </span>
              )}
            </motion.div>
          ))}

          {pending && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
            >
              <span className="terminal-cursor">▍</span>
              {t("connecting")}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 border-t border-border pt-4"
      >
        <span className="font-mono text-terminal-green">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          disabled={pending}
          className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          size="sm"
          disabled={pending || !input.trim()}
          className="bg-terminal-green font-mono text-background hover:bg-terminal-green/90"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("send")}</span>
        </Button>
      </form>
    </TerminalWindow>
  );
}
