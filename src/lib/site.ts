// Dominio que realmente responde: creativabalam.com.mx redirige aquí.
export const SITE_URL = "https://www.creativabalam.com.mx";

export const REDES_SOCIALES = [
  "https://www.instagram.com/creativa.balam",
  "https://www.facebook.com/share/1DDmghk3aK/",
  "https://www.tiktok.com/@balam.agencia.creativa",
];

// Número de WhatsApp de Creativa Balam (sin + ni espacios, formato wa.me).
export const WHATSAPP_NUMBER = "529871123961";

export function whatsappUrl(texto: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}
