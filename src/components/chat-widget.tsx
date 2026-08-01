"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, Minus, RotateCcw, ChevronDown } from "lucide-react";
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
const CHAT_STORAGE_KEY = "balam:chat-history";

type StoredChat = {
  messages: Message[];
  conversationId?: string;
  visitorId?: string;
};

function loadStoredChat(): StoredChat | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredChat;
  } catch {
    return null;
  }
}

export function ChatWidget() {
  const t = useTranslations("chat");
  const term = useTranslations("terminal");
  const pathname = usePathname();

  // Se lee UNA sola vez, vía el inicializador perezoso de useState (nunca
  // tocando un ref durante el render) — evita el patrón "leer localStorage
  // en un efecto y llamar setState ahí adentro", que dispara un render en
  // cascada extra y además causa un parpadeo (primero vacío, luego con
  // historial).
  const [initialChat] = useState<StoredChat | null>(() => loadStoredChat());
  const hasStoredHistory = Boolean(initialChat?.messages?.length);

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bootStarted = useRef(hasStoredHistory);
  const bootCancelled = useRef(hasStoredHistory);
  const bootTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const conversationId = useRef<string | undefined>(initialChat?.conversationId);
  const visitorId = useRef<string>(
    initialChat?.visitorId ??
      (typeof crypto !== "undefined" ? crypto.randomUUID() : "balam-visitor"),
  );

  const [isExpanded, setIsExpanded] = useState(pathname === "/");
  const [messages, setMessages] = useState<Message[]>(
    initialChat?.messages ?? [],
  );
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  // ── Deslizar hacia abajo sobre el header para minimizar (bottom sheet) ──
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const DRAG_THRESHOLD_PX = 70;

  /**
   * Minimizar el panel, quitándole el foco al input explícitamente. Si el
   * input se queda enfocado (ej. al minimizar deslizando el dedo, en vez de
   * tocar un botón que naturalmente roba el foco), un toque posterior sobre
   * el mismo input no dispara un nuevo evento 'focus' (ya estaba enfocado),
   * así que el panel nunca se volvía a expandir.
   */
  function handleMinimize() {
    setIsExpanded(false);
    inputRef.current?.blur();
  }

  function handleHeaderTouchStart(e: React.TouchEvent) {
    dragStartY.current = e.touches[0].clientY;
  }

  function handleHeaderTouchMove(e: React.TouchEvent) {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    setDragOffset(Math.max(0, delta));
  }

  function handleHeaderTouchEnd() {
    if (dragOffset > DRAG_THRESHOLD_PX) {
      handleMinimize();
    }
    setDragOffset(0);
    dragStartY.current = null;
  }

  const bootSegments: BootSegment[] = [
    { kind: "cmd", text: term("whoami") },
    { kind: "output", text: term("whoamiOut") },
    { kind: "cmd", text: "cat stack.txt" },
    { kind: "output", text: term("stackOut") },
    { kind: "cmd", text: "cat status.txt" },
    { kind: "output", text: term("statusOut") },
  ];

  const [revealedCount, setRevealedCount] = useState(
    hasStoredHistory ? bootSegments.length : 0,
  );
  const [partialText, setPartialText] = useState("");
  const [bootFinished, setBootFinished] = useState(hasStoredHistory);

  useEffect(() => {
    // isExpanded en las dependencias: el contenedor con scroll solo existe
    // en el DOM mientras el panel está expandido (se desmonta al minimizar,
    // ver más abajo) -- al reabrir se monta uno nuevo con scrollTop en 0, y
    // sin isExpanded aquí este efecto no se volvía a disparar, dejando el
    // boot arriba en vez de saltar al final de la conversación real.
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending, revealedCount, partialText, isExpanded]);

  // Guarda la conversación en cada cambio, para que sobreviva a un reload.
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      const toSave: StoredChat = {
        messages,
        conversationId: conversationId.current,
        visitorId: visitorId.current,
      };
      window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // localStorage no disponible — la conversación sigue funcionando en memoria.
    }
  }, [messages]);

  function skipBoot() {
    if (bootFinished) return;
    bootCancelled.current = true;
    bootTimeouts.current.forEach(clearTimeout);
    bootTimeouts.current = [];
    setRevealedCount(bootSegments.length);
    setPartialText("");
    setBootFinished(true);
  }

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
        handleMinimize();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isExpanded]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!isExpanded) {
      setIsExpanded(true);
    }
    const trimmed = input.trim();
    if (!trimmed || pending) return;
    skipBoot();

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
    try {
      window.localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // localStorage no disponible — nada que limpiar.
    }
  }

  const inProgress = revealedCount < bootSegments.length ? bootSegments[revealedCount] : null;

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full flex-col transition-[max-height] duration-300 ease-in-out",
        // dvh (dynamic viewport height), no vh -- con interactive-widget:
        // resizes-content, vh no siempre recalcula de forma confiable al
        // abrir el teclado en Android (a veces el panel se quedaba
        // colapsado aunque isExpanded ya fuera true). dvh sí responde.
        isExpanded ? "max-h-[85dvh] sm:max-h-[75dvh]" : "max-h-16",
      )}
      style={{
        maxWidth: "768px",
        transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
        transition: dragOffset ? "none" : undefined,
      }}
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-t-2xl border-x border-t border-terminal-green/25 bg-background/95 shadow-2xl backdrop-blur-md glow-border">
        {isExpanded && (
          <>
            <div
              onTouchStart={handleHeaderTouchStart}
              onTouchMove={handleHeaderTouchMove}
              onTouchEnd={handleHeaderTouchEnd}
              className="touch-none border-b border-border"
            >
              <div className="flex justify-center pt-1 pb-0.5">
                <ChevronDown className="h-3 w-3 text-terminal-green/40" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-2 px-4 pb-2.5">
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
                  onClick={handleMinimize}
                  aria-label={t("minimize")}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
              </div>
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
                <p className="pl-4 text-muted-foreground">
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
                        <p className="whitespace-pre-wrap pl-4 text-muted-foreground">
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

        <div
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
              onFocus={() => {
                setIsExpanded(true);
                skipBoot();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={pending}
              type="search"
              name="balam-chat-message"
              /* Sin nombre accesible, un lector de pantalla anuncia esto como
                 un campo de búsqueda vacío y el usuario no sabe qué escribir.
                 Va como aria-label y no como <label> visible porque el diseño
                 de terminal no tiene dónde ponerlo sin romperse. Detectado
                 por Lighthouse (accesibilidad 84, 1 ago 2026). */
              aria-label={t("inputLabel")}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore=""
              data-form-type="other"
              className="w-full appearance-none bg-transparent font-mono text-sm text-foreground caret-terminal-green focus:outline-none disabled:opacity-50 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
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
            type="button"
            onClick={() => handleSubmit()}
            size="sm"
            disabled={pending || !input.trim()}
            /* En móvil el texto se oculta (`hidden sm:inline`) y quedaba solo
               el icono: un lector de pantalla anunciaba "botón", sin más.
               El aria-label lo nombra siempre, se vea o no el texto. */
            aria-label={t("sendLabel")}
            className="bg-terminal-green font-mono text-background hover:bg-terminal-green/90"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t("send")}</span>
          </Button>
        </div>
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
