"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, Minus, RotateCcw } from "lucide-react";
import { usePathname } from "@/i18n/navigation";

export const OPEN_CHAT_EVENT = "balam:open-chat";

type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  text: string;
};

function makeGreeting(text: string): Message {
  return { id: "greeting", role: "system", text };
}

export function ChatWidget() {
  const t = useTranslations("chat");
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(pathname === "/");
  const [messages, setMessages] = useState<Message[]>([
    makeGreeting(t("systemGreeting")),
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending, isExpanded]);

  useEffect(() => {
    function onOpen() {
      setIsExpanded(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!isExpanded) return;
    function onPointerDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isExpanded]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isExpanded) {
      setIsExpanded(true);
    }
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

  function handleReset(e: React.MouseEvent) {
    e.stopPropagation();
    setMessages([makeGreeting(t("systemGreeting"))]);
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full flex-col transition-[max-height] duration-300 ease-in-out",
        isExpanded ? "max-h-[85vh] sm:max-h-[75vh]" : "max-h-16",
      )}
      style={{ maxWidth: "768px" }}
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-t-2xl border-x border-t border-terminal-green/25 bg-background/95 shadow-2xl backdrop-blur-md glow-border">
        {isExpanded && (
          <>
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-terminal-green" />
                <div className="leading-tight">
                  <p className="font-mono text-sm text-foreground">
                    creativa_balam
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {t("widgetSubtitle")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label={t("reset")}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  aria-label={t("minimize")}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-thin p-4"
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
                        <a
                          href="mailto:balamcozu@proton.me"
                          className="hover:underline"
                        >
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
          </>
        )}

        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex shrink-0 items-center gap-2 px-4",
            isExpanded ? "border-t border-border py-3" : "h-16",
          )}
        >
          <span className="font-mono text-terminal-green">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsExpanded(true)}
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
      </div>
    </div>
  );
}
