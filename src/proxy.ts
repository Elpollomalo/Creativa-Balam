import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

// Las páginas de campaña solo existen en español. El middleware de idiomas
// agrega por defecto una cabecera Link con hreflang="en" hacia una URL que
// no existe (404), y eso le resta puntos de SEO. Aquí la quitamos.
const SOLO_ESPANOL = ["/paginas-web-cozumel"];

export default function proxy(request: NextRequest) {
  const response = intl(request);
  const { pathname } = request.nextUrl;
  if (SOLO_ESPANOL.some((r) => pathname === r || pathname.startsWith(`${r}/`))) {
    response.headers.delete("link");
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
