import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

// Las páginas de campaña solo existen en español. Sin esto, el middleware de
// idiomas manda a /en/... (404) a quien tenga el navegador en inglés o la
// cookie NEXT_LOCALE=en, y además agrega una cabecera Link con hreflang="en"
// hacia esa misma URL inexistente. Aquí forzamos español y quitamos la cabecera.
const SOLO_ESPANOL = ["/paginas-web-cozumel"];

function esSoloEspanol(pathname: string) {
  return SOLO_ESPANOL.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

export default function proxy(request: NextRequest) {
  if (!esSoloEspanol(request.nextUrl.pathname)) return intl(request);

  const headers = new Headers(request.headers);
  headers.set("accept-language", "es");
  const cookies = (headers.get("cookie") ?? "")
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c && !c.startsWith("NEXT_LOCALE="));
  if (cookies.length) headers.set("cookie", cookies.join("; "));
  else headers.delete("cookie");

  const response = intl(new NextRequest(request, { headers }));
  response.headers.delete("link");
  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
