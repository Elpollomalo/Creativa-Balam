import { NextResponse } from "next/server";

// Recibe el formulario de la landing de campañas y avisa al estudio.
//
// Variables de entorno (todas del lado del servidor, en Vercel):
//   RESEND_API_KEY      → clave de Resend para mandar el correo de aviso.
//   LEAD_NOTIFY_EMAIL   → a qué buzón llega el aviso del contacto.
//   LEAD_FROM_EMAIL     → opcional; por defecto hola@creativabalam.com.mx.
//   TELEGRAM_BOT_TOKEN  → opcional, con TELEGRAM_CHAT_ID: aviso por Telegram.
//   TELEGRAM_CHAT_ID
//
// Sin ningún canal configurado responde { configured: false } y el formulario
// le ofrece WhatsApp al visitante: nunca se pierde un contacto en silencio.

type LeadBody = {
  nombre?: unknown;
  telefono?: unknown;
  negocio?: unknown;
  mensaje?: unknown;
  website?: unknown;
  gclid?: unknown;
  utm_source?: unknown;
  utm_campaign?: unknown;
  utm_term?: unknown;
};

// Límite simple por IP (en memoria; en serverless es "mejor esfuerzo", suficiente
// contra envíos repetidos accidentales o bots poco sofisticados).
const VENTANA_MS = 10 * 60 * 1000;
const MAX_ENVIOS = 5;
const envios = new Map<string, number[]>();

function excedeLimite(ip: string): boolean {
  const ahora = Date.now();
  const recientes = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  envios.set(ip, recientes);
  return recientes.length > MAX_ENVIOS;
}

function texto(valor: unknown, max: number): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}

function escapaHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Honeypot: si viene lleno es un bot. Respondemos "ok" para no darle pistas.
  if (texto(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const nombre = texto(body.nombre, 100);
  const telefono = texto(body.telefono, 20);
  const negocio = texto(body.negocio, 120);
  const mensaje = texto(body.mensaje, 800);
  const origen = {
    gclid: texto(body.gclid, 200),
    fuente: texto(body.utm_source, 80),
    campana: texto(body.utm_campaign, 120),
    palabra: texto(body.utm_term, 120),
  };

  const digitos = telefono.replace(/\D/g, "");
  if (nombre.length < 2 || digitos.length < 8 || digitos.length > 15) {
    return NextResponse.json({ error: "invalid fields" }, { status: 400 });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "desconocida")
    .split(",")[0]
    .trim();
  if (excedeLimite(ip)) {
    return NextResponse.json({ error: "too many requests" }, { status: 429 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const correoDestino = process.env.LEAD_NOTIFY_EMAIL;
  const correoOrigen =
    process.env.LEAD_FROM_EMAIL ?? "Creativa Balam <hola@creativabalam.com.mx>";
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;

  const hayCorreo = Boolean(resendKey && correoDestino);
  const hayTelegram = Boolean(tgToken && tgChat);
  if (!hayCorreo && !hayTelegram) {
    return NextResponse.json({ configured: false });
  }

  const lineas = [
    ["Nombre", nombre],
    ["WhatsApp / teléfono", telefono],
    ["Negocio", negocio || "—"],
    ["Mensaje", mensaje || "—"],
    ["Palabra clave", origen.palabra || "—"],
    ["Campaña", origen.campana || "—"],
    ["Fuente", origen.fuente || "—"],
    ["GCLID", origen.gclid || "—"],
  ] as const;

  const envia: Promise<boolean>[] = [];

  if (hayCorreo) {
    const html = `<h2>Nuevo contacto desde la landing de páginas web</h2><table cellpadding="6">${lineas
      .map(
        ([k, v]) =>
          `<tr><td><b>${escapaHtml(k)}</b></td><td>${escapaHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
      )
      .join("")}</table>`;
    envia.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: correoOrigen,
          to: [correoDestino],
          subject: `Nuevo contacto: ${nombre}${negocio ? ` (${negocio})` : ""}`,
          html,
        }),
      })
        .then((r) => r.ok)
        .catch(() => false),
    );
  }

  if (hayTelegram) {
    const mensajeTg = [
      "🟢 Nuevo contacto desde la landing de páginas web",
      ...lineas.map(([k, v]) => `${k}: ${v}`),
    ].join("\n");
    envia.push(
      fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChat, text: mensajeTg }),
      })
        .then((r) => r.ok)
        .catch(() => false),
    );
  }

  // Basta con que UN canal haya avisado para dar el contacto por recibido.
  const resultados = await Promise.all(envia);
  if (resultados.some(Boolean)) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "delivery failed" }, { status: 502 });
}
