import { NextResponse } from "next/server";

// Stub endpoint for the "Talk with Balam" chat.
// Swap the body of this handler for a real call to the Dify/n8n
// endpoint once DIFY_CHAT_API_KEY is available — the ChatPanel
// component already speaks this request/response shape.
export async function POST(request: Request) {
  const { message } = (await request.json()) as { message?: string };

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "empty message" }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
