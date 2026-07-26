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
  role: "user" | "assistant";
  text: string;
  isFallback?: boolean;
};

type BootSegment =
  | { kind: "cmd"; text: string }
  | { kind: "output"; text: string }
  | { kind: "message"; text: string };

const CMD_MS_PER_CHAR = 14;
const TEXT_MS_PER_CHAR = 8;
const SEGMENT_PAUSE_MS = 350;

export function ChatWidget() {
  const t = useTranslations("chat");
  const term = useTranslations("terminal");
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(pathname === "/");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bootStarted = useRef(false);
  const bootCancelled = useRef(false);
  const bootTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const conversationId = useRef<string | undefined>(undefined);
  const visitorId = useRef<string>(
    typeof crypto !== "undefined" ? crypto.randomUUID() : "balam-visitor",
  );

  const bootSegments: BootSegment[] = [
    { kind: "cmd", text: term("whoami") },
    { kind: "output", text: term("whoamiOut") },
    { kind: "cmd", text: "cat stack.txt" },
    { kind: "output", text: term("stackOut") },
    { kind: "cmd", text: "cat status.txt" },
    { kind: "output", text: term("statusOut") },
  ];

  const [revealedCount, setRevealedCount] = useState(0);
  const [partialText, setPartialText] = useState("");
  const [bootFinished, setBootFinished] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending, revealedCount, partialText]);

  useEffect(() => {
    if (!isExpanded || bootStarted.current) return;
    bootStarted.current = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      const id = setTimeout(() => {
        setRevealedCount(bootSegments.length);
        setBootFinished(true);
      }, 0);
      bootTimeouts.current.push(id);
      return;
    }

    async function typeSegment(index: number) {
      if (bootCancelled.current) return;
      if (index >= bootSegments.length) {
        setBootFinished(true);
        return;
      }
      const segment = bootSegments[index];
      const speed = segment.kind === "cmd" ? CMD_MS_PER_CHAR : TEXT_MS_PER_CHAR;

      for (let i = 1; i <= segment.text.length; i++) {
        await new Promise<void>((resolve) => {
          const id = setTimeout(resolve, speed);
          bootTimeouts.current.push(id);
        });
        if (bootCancelled.current) return;
        setPartialText(segment.text.slice(0, i));
      }

      if (bootCancelled.current) return;
      setRevealedCount(index + 1);
      setPartialText("");

      await new Promise<void>((resolve) => {
        const id = setTimeout(resolve, SEGMENT_PAUSE_MS);
        bootTimeouts.current.push(id);
      });
      typeSegment(index + 1);
    }

    typeSegment(0);
    // Sin cleanup ligado a `isExpanded`: minimizar el chat a mitad de la
    // animación de boot NO debe cancelarla (bug real en producción — el
    // texto se quedaba congelado a mitad para siempre al volver a abrir,
    // porque bootStarted.current ya era true y el efecto no reintentaba).
    // El único cleanup real vive en el efecto de abajo, atado al desmontaje.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  useEffect(() => {
    return () => {
      bootCancelled.current = true;
      bootTimeouts.current.forEach(clearTimeout);
    };
  }, []);

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
    if (!trimmed || pending || !bootFinished) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversationId: conversationId.current,
          user: visitorId.current,
        }),
      });
      const data = (await res.json()) as {
        configured?: boolean;
        answer?: string;
        conversationId?: string;
        error?: string;
      };

      if (data.configured && data.answer) {
        conversationId.current = data.conversationId ?? conversationId.current;
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", text: data.answer! },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: t("stubReply"),
            isFallback: true,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: t("stubReply"),
          isFallback: true,
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  function handleReset(e: React.MouseEvent) {
    e.stopPropagation();
    setMessages([]);
    conversationId.current = undefined;
  }

  const inProgress = revealedCount < bootSegments.length ? bootSegments[revealedCount] : null;

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
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                balam@terminal
              </span>
              <div className="ml-auto flex items-center gap-1">
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
              className="flex flex-1 flex-col gap-3 overflow-y-auto scrollbar-thin p-4 font-mono text-sm leading-relaxed"
            >
              {bootSegments.slice(0, revealedCount).map((seg, i) => (
                <BootLine key={i} segment={seg} />
              ))}

              {inProgress && (
                <BootLine
                  segment={{ ...inProgress, text: partialText } as BootSegment}
                  cursor
                />
              )}

              {bootFinished && (
                <p className="pl-4 text-xs text-muted-foreground">
                  {t("disclaimer")}
                </p>
              )}

              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {m.role === "user" ? (
                      <p>
                        <span className="text-terminal-cyan">$</span>{" "}
                        <span className="text-foreground">{m.text}</span>
                      </p>
                    ) : (
                      <>
                        <p className="text-terminal-green">$ balam</p>
                        <p className="whitespace-pre-wrap pl-4 text-foreground/90">
                          {m.text}
                        </p>
                        {m.isFallback && (
                          <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 pl-4 text-xs text-terminal-green">
                            <a
                              href="mailto:balamcozu@proton.me"
                              className="hover:underline"
                            >
                              balamcozu@proton.me
                            </a>
                            <a
                              href="tel:+529871123961"
                              className="hover:underline"
                            >
                              +52 987 112 3961
                            </a>
                          </p>
                        )}
                      </>
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
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              disabled={pending || (isExpanded && !bootFinished)}
              className="w-full bg-transparent font-mono text-sm text-foreground caret-terminal-green focus:outline-none disabled:opacity-50"
            />
            {!input && (
              <span
                aria-hidden
                className="terminal-cursor pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-terminal-green"
              >
                ▍
              </span>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={pending || !input.trim() || (isExpanded && !bootFinished)}
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

function BootLine({
  segment,
  cursor,
}: {
  segment: BootSegment;
  cursor?: boolean;
}) {
  if (segment.kind === "cmd") {
    return (
      <p>
        <span className="text-terminal-green">$</span>{" "}
        <span className="text-foreground">{segment.text}</span>
        {cursor && (
          <span className="terminal-cursor text-terminal-green">▍</span>
        )}
      </p>
    );
  }

  return (
    <p
      className={cn(
        "whitespace-pre-wrap text-muted-foreground",
        segment.kind === "output" && "pl-4",
      )}
    >
      {segment.text}
      {cursor && (
        <span className="terminal-cursor text-terminal-green">▍</span>
      )}
    </p>
  );
}
