import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// diagnostico.creativabalam.com.mx es un dominio independiente para la
// herramienta de diagnóstico — no lleva el resto del sitio (nav/chat
// terminal). Reescribe internamente a /es/diagnostico[...], sin exponer
// el prefijo en la URL visible.
const DIAGNOSTICO_HOST = "diagnostico.creativabalam.com.mx";

export default function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";

  if (host === DIAGNOSTICO_HOST || host.startsWith(`${DIAGNOSTICO_HOST}:`)) {
    const { pathname } = request.nextUrl;
    const alreadyRouted = /^\/(es|en)?\/?diagnostico(\/|$)/.test(pathname);
    if (!alreadyRouted) {
      const url = request.nextUrl.clone();
      url.pathname = `/es/diagnostico${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
