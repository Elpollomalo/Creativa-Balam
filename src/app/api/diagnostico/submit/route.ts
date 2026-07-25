import { NextResponse } from "next/server";

// El formulario ya guardó la respuesta en Supabase (client-side, con RLS).
// Esta route solo reenvía los datos al workflow de n8n que genera el plan
// y lo manda por Telegram. Sin N8N_DIAGNOSTICO_WEBHOOK_URL configurada,
// no hace nada — no bloquea ni rompe el envío del formulario.
export async function POST(request: Request) {
  const body = await request.json();

  const webhookUrl = process.env.N8N_DIAGNOSTICO_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ configured: false });
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json({ configured: true, sent: true });
  } catch {
    return NextResponse.json(
      { configured: true, sent: false },
      { status: 502 },
    );
  }
}
