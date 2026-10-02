/**
 * Manda un evento a Google Analytics 4 (gtag ya viene cargado desde el layout).
 * Si gtag no existe (bloqueador de anuncios, sin conexión) no pasa nada: el
 * seguimiento nunca debe romper el formulario ni el botón de WhatsApp.
 *
 * Eventos que usa la landing de campañas:
 *  - generate_lead   → el visitante envió el formulario.
 *  - whatsapp_click  → el visitante tocó un botón de WhatsApp.
 * Hay que marcarlos como "eventos clave" en GA4 para importarlos a Google Ads.
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  try {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
    };
    w.gtag?.("event", event, params);
  } catch {
    // sin seguimiento, el resto sigue funcionando
  }
}
