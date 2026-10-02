"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { whatsappUrl } from "@/lib/site";

type Estado = "reposo" | "enviando" | "enviado" | "sin-configurar" | "error";

const TEXTO_WHATSAPP_RESPALDO =
  "Hola, vi su página de páginas web para negocios en Cozumel y quiero información.";

const campo =
  "w-full rounded-lg border border-border bg-background px-3.5 py-3 text-base text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-terminal-green/60 focus:ring-2 focus:ring-terminal-green/20";

/**
 * Formulario corto de contacto de la landing. Manda los datos a /api/lead y,
 * si el visitante prefiere WhatsApp o algo falla, siempre le deja esa salida
 * (nunca se pierde un contacto por un error del formulario).
 */
export function LeadForm() {
  const [estado, setEstado] = useState<Estado>("reposo");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;
    const form = e.currentTarget;
    const datos = new FormData(form);
    const params = new URLSearchParams(window.location.search);

    setEstado("enviando");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: datos.get("nombre"),
          telefono: datos.get("telefono"),
          negocio: datos.get("negocio"),
          mensaje: datos.get("mensaje"),
          // honeypot: un humano nunca lo ve ni lo llena
          website: datos.get("website"),
          // de dónde vino el clic (anuncio / palabra clave)
          gclid: params.get("gclid") ?? "",
          utm_source: params.get("utm_source") ?? "",
          utm_campaign: params.get("utm_campaign") ?? "",
          utm_term: params.get("utm_term") ?? "",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        configured?: boolean;
      };

      if (res.ok && json.ok) {
        track("generate_lead", { zona: "formulario" });
        form.reset();
        setEstado("enviado");
      } else if (res.ok && json.configured === false) {
        setEstado("sin-configurar");
      } else {
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
  }

  if (estado === "enviado") {
    return (
      <div
        role="status"
        className="rounded-xl border border-terminal-green/40 bg-terminal-green/5 p-6 text-center"
      >
        <p className="text-lg font-medium text-foreground">
          ¡Listo, recibimos tus datos!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Te contactamos en menos de 24 horas. Si prefieres no esperar, también
          puedes escribirnos por WhatsApp.
        </p>
        <a
          href={whatsappUrl(TEXTO_WHATSAPP_RESPALDO)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { zona: "gracias" })}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-terminal-green px-5 text-sm font-semibold text-background hover:bg-terminal-green/90"
        >
          Escribir por WhatsApp
        </a>
      </div>
    );
  }

  const falloEnvio = estado === "error" || estado === "sin-configurar";

  return (
    <form onSubmit={enviar} className="space-y-4" noValidate={false}>
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium">
          Tu nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="telefono" className="mb-1.5 block text-sm font-medium">
          WhatsApp o teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          required
          minLength={8}
          maxLength={20}
          autoComplete="tel"
          placeholder="987 123 4567"
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="negocio" className="mb-1.5 block text-sm font-medium">
          Nombre o tipo de negocio{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="negocio"
          name="negocio"
          type="text"
          maxLength={120}
          autoComplete="organization"
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="mb-1.5 block text-sm font-medium">
          ¿Qué necesitas?{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={3}
          maxLength={800}
          className={campo}
        />
      </div>

      {/* Honeypot: fuera de pantalla, sin foco; los bots lo llenan, las personas no. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">No llenar este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-terminal-green px-5 text-base font-semibold text-background transition-colors hover:bg-terminal-green/90 disabled:opacity-60"
      >
        {estado === "enviando" ? "Enviando..." : "Quiero información"}
      </button>

      {falloEnvio && (
        <p role="alert" className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
          No pudimos enviar el formulario en este momento. Escríbenos directo
          por{" "}
          <a
            href={whatsappUrl(TEXTO_WHATSAPP_RESPALDO)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { zona: "error-formulario" })}
            className="font-medium text-terminal-green underline underline-offset-2"
          >
            WhatsApp
          </a>{" "}
          y te atendemos de inmediato.
        </p>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Usamos tus datos únicamente para responderte sobre tu proyecto. Sin
        compromiso.
      </p>
    </form>
  );
}
