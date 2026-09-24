"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, Minus, RotateCcw, ChevronDown } from "lucide-react";

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
// Más lento que el boot (8ms): ese texto es un dump que se lee de corrido;
// este es lo primero que alguien ve del chat, tiene que dar tiempo a leerse.
const HINT_MS_PER_CHAR = 45;
const CHAT_STORAGE_KEY = "balam:chat-history";
// El mismo número de contacto del footer y del layout (JSON-LD).
const WHATSAPP_NUMBER = "529871123961";

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

  // Antes se abría solo en la home (`pathname === "/"`). Carlos, 24 sep 2026:
  // no quiere que el chat se abra de inmediato -- que primero se vea la
  // barra minimizada con el texto animado (ver `collapsedHint` abajo), y que
  // la intro de boot salga hasta que el usuario lo abra.
  const [isExpanded, setIsExpanded] = useState(false);
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

  /**
   * La barra minimizada escribe, letra por letra y una sola vez, una frase
   * completa: quién habla y qué ofrece. Carlos, 24 sep 2026, rechazó un
   * nombre suelto ("el asistente virtual de creativa balam" no dice nada) y
   * partirlo en dos frases que se borran ("se ve horrible"). Va en la letra
   * del terminal y, si no cabe en una línea, baja a la segunda.
   */
  const [collapsedHint, setCollapsedHint] = useState("");

  useEffect(() => {
    const fullText = t("collapsedHint");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function typeChar(i: number) {
      if (cancelled) return;
      setCollapsedHint(fullText.slice(0, i));
      if (i < fullText.length) {
        timeouts.push(setTimeout(() => typeChar(i + 1), HINT_MS_PER_CHAR));
      }
    }
    // Arranca en un setTimeout (no directo en el efecto) por la regla de
    // react-hooks contra setState síncrono dentro de un efecto.
    timeouts.push(
      setTimeout(() => typeChar(reduceMotion ? fullText.length : 1), 0),
    );

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [t]);

  /**
   * La pestaña de WhatsApp solo se asoma pasado el hero: arriba estorba y el
   * hero ya tiene sus dos botones. Carlos, 24 sep 2026.
   */
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.6);
    }
    // En un rAF (no directo) por la regla contra setState síncrono en efectos;
    // cubre el caso de recargar la página ya scrolleada.
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const showWhatsapp = pastHero && !isExpanded;

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
      {/* WhatsApp como pestaña de terminal que se asoma por detrás de la
          barra del chat (no un botón flotante más): no ocupa lugar dentro de
          la barra, no aparece en el hero y se esconde al abrir el chat.
          `-z-10` la deja detrás del panel, así sube "desde adentro". */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("whatsappText"))}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsappLabel")}
        aria-hidden={!showWhatsapp}
        tabIndex={showWhatsapp ? 0 : -1}
        className={cn(
          "absolute bottom-full right-5 -z-10 -mb-px flex items-center gap-2 rounded-t-lg border-x border-t border-terminal-green/25 bg-background/95 px-3 pt-1.5 pb-1 font-mono text-xs text-muted-foreground backdrop-blur-md transition-all duration-500 ease-out hover:text-terminal-green",
          showWhatsapp
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-terminal-green" />
        </span>
        <WhatsappIcon className="h-3.5 w-3.5 text-terminal-green" />
        whatsapp
      </a>

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
                // Antes saltaba la intro (`skipBoot()`) apenas se enfocaba
                // el input, que era casi siempre -- así nunca se veía la
                // animación de boot. Carlos, 24 sep 2026: que al abrir salga
                // la intro normal. Se sigue saltando si el usuario ya manda
                // un mensaje (ver `handleSubmit`).
                setIsExpanded(true);
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
            {!input && !isExpanded && (
              // Minimizado: el cursor solo no dice qué es esto. El hint
              // escrito letra por letra (arriba) avisa que hay un asistente
              // ahí antes de que alguien lo abra.
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 font-mono text-xs leading-snug text-muted-foreground"
              >
                {collapsedHint}
                <span className="terminal-cursor text-terminal-green">▍</span>
              </span>
            )}
            {!input && isExpanded && (
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

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43m8.03-17.46A11.28 11.28 0 0 0 12.05.7C5.8.7.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.34 11.34 0 0 0 5.42 1.38h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03" />
    </svg>
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
