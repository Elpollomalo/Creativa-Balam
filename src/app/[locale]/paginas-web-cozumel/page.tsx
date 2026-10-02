import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { Logo } from "@/components/logo";
import { LeadForm } from "@/components/lead-form";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { REDES_SOCIALES, SITE_URL } from "@/lib/site";

/**
 * Landing de campañas de Google Ads: "páginas web para negocios en Cozumel".
 *
 * Una sola salida clara (WhatsApp o formulario), sin terminal ni navegación
 * del sitio (ver SiteChrome en el layout). Sin precios, a propósito (Carlos,
 * 2 oct 2026). Solo español por ahora: la versión en inglés se hará aparte.
 * Todo lo que afirma esta página sale del portafolio y del copy reales del
 * sitio; no hay cifras, plazos ni testimonios inventados.
 */

const TEXTO_WHATSAPP =
  "Hola, vi su página de páginas web para negocios en Cozumel y quiero información.";

const boton =
  "inline-flex h-12 items-center justify-center rounded-lg px-6 text-base font-semibold transition-colors";
const botonPrimario = `${boton} bg-terminal-green text-background hover:bg-terminal-green/90`;
const botonSecundario = `${boton} border border-border text-foreground hover:border-terminal-green/50 hover:text-terminal-green`;

const proyectos = [
  {
    nombre: "Cozumel Glass Art",
    descripcion:
      "Galería de arte en vidrio, en español e inglés, con catálogo por artista, eventos con registro y panel de administración.",
    url: "https://cozumelglassart.com",
  },
  {
    nombre: "CozuTours",
    descripcion:
      "Reservas de tours en Cozumel para una operadora local, con depósito en línea y correos de confirmación.",
    url: "https://www.cozutours.com",
  },
  {
    nombre: "Blue Reef Divers",
    descripcion:
      "Sitio de buceo y esnórquel en Cozumel con catálogo de tours y reserva con depósito.",
    url: "https://www.bluereefdiversmx.com",
  },
  {
    nombre: "Tourquesa Adventures",
    descripcion:
      "Plataforma de reservas para tours en el Caribe mexicano, con depósito en línea.",
    url: "https://www.tourquesa.com.mx",
  },
];

const beneficios = [
  {
    titulo: "Hecha para tu marca",
    texto:
      "Diseñada a la medida de tu negocio y de lo que vendes, no una plantilla genérica.",
  },
  {
    titulo: "Rápida y lista para el celular",
    texto:
      "La mayoría de tus clientes te verá desde el teléfono, así que empezamos por ahí.",
  },
  {
    titulo: "Para que te encuentren en Google",
    texto:
      "La construimos con las bases de posicionamiento (SEO) para que aparezcas cuando te busquen.",
  },
  {
    titulo: "En español y en inglés",
    texto:
      "Ideal si atiendes turismo: tus clientes leen tu sitio en su idioma.",
  },
  {
    titulo: "Reservas, pagos y catálogo",
    texto:
      "Si lo necesitas, tu sitio puede recibir reservas con depósito, mostrar productos o abrir tus eventos.",
  },
  {
    titulo: "Tú la administras",
    texto:
      "Podemos incluir un panel para que cambies textos, fotos o productos sin depender de nadie.",
  },
];

const pasos = [
  {
    titulo: "Nos cuentas tu idea",
    texto: "Por WhatsApp o con el formulario. Solo necesitamos saber qué hace tu negocio y qué quieres lograr.",
  },
  {
    titulo: "Te presentamos una propuesta",
    texto: "Clara y sin compromiso: qué vamos a hacer, cómo y en cuánto tiempo.",
  },
  {
    titulo: "La construimos y la publicamos",
    texto: "La revisas con nosotros, hacemos los ajustes y queda en línea.",
  },
];

const preguntas = [
  {
    q: "¿Cuánto cuesta una página web?",
    a: "Depende de lo que necesite tu negocio: no es lo mismo una página de presentación que un sitio con reservas y pagos. Cuéntanos tu caso y te enviamos una cotización sin compromiso.",
  },
  {
    q: "¿Cuánto tardan en hacerla?",
    a: "Lo definimos en la propuesta, según el alcance de tu proyecto. Antes de empezar sabrás los tiempos.",
  },
  {
    q: "¿Puedo actualizarla yo mismo?",
    a: "Sí. Si lo necesitas, incluimos un panel para que cambies textos, fotos o productos sin depender de nadie.",
  },
  {
    q: "¿La pueden hacer también en inglés?",
    a: "Sí, podemos hacer tu sitio en español e inglés, algo muy útil si atiendes turismo en Cozumel.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Solo contarnos qué hace tu negocio y qué quieres lograr con tu página. Nosotros te guiamos con lo demás.",
  },
];

export function generateStaticParams() {
  return [{ locale: "es" }];
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "Páginas web para negocios en Cozumel | Creativa Balam";
  const description =
    "Diseñamos páginas web para negocios en Cozumel: rápidas, listas para el celular y pensadas para que te encuentren en Google. Cuéntanos tu idea por WhatsApp.";
  return {
    title,
    description,
    alternates: { canonical: "/paginas-web-cozumel", languages: {} },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/paginas-web-cozumel`,
      siteName: "Creativa Balam",
      locale: "es_MX",
      type: "website",
    },
  };
}

export default async function PaginasWebCozumelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col pb-24 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Creativa Balam",
            url: `${SITE_URL}/paginas-web-cozumel`,
            description:
              "Diseño y desarrollo de páginas web para negocios en Cozumel, Quintana Roo.",
            telephone: "+52-987-112-3961",
            email: "hola@creativabalam.com.mx",
            areaServed: "Cozumel, Quintana Roo, México",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Cozumel",
              addressRegion: "Quintana Roo",
              addressCountry: "MX",
            },
            sameAs: REDES_SOCIALES,
          }),
        }}
      />

      {/* Encabezado mínimo: marca + WhatsApp. Sin enlaces que saquen al visitante. */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <WhatsAppLink
            zona="encabezado"
            texto={TEXTO_WHATSAPP}
            className="inline-flex h-10 items-center rounded-lg border border-terminal-green/50 px-4 text-sm font-medium text-terminal-green transition-colors hover:bg-terminal-green/10"
          >
            WhatsApp
          </WhatsAppLink>
        </div>
      </header>

      {/* Portada */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <p className="mb-4 text-sm font-medium tracking-wide text-terminal-green">
            Cozumel, Quintana Roo
          </p>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Páginas web para negocios en Cozumel
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Diseñamos tu sitio para que te encuentren en Google, se vea bien en
            el celular y tus clientes puedan escribirte, reservar o comprar sin
            complicaciones.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppLink
              zona="portada"
              texto={TEXTO_WHATSAPP}
              className={`${botonPrimario} w-full sm:w-auto`}
            >
              Escríbenos por WhatsApp
            </WhatsAppLink>
            <a href="#contacto" className={`${botonSecundario} w-full sm:w-auto`}>
              Pedir información
            </a>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Cotización sin compromiso · Respondemos en menos de 24 horas
          </p>
        </div>
      </section>

      {/* Prueba: trabajo real en Cozumel */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Sitios que ya funcionan en Cozumel
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Trabajo real para negocios de la isla. Puedes entrar a verlos.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {proyectos.map((p) => (
              <a
                key={p.nombre}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-terminal-green/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-medium">{p.nombre}</h3>
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-terminal-green" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.descripcion}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Qué hacemos */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Lo que hacemos por tu negocio
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {beneficios.map((b) => (
              <div key={b.titulo}>
                <h3 className="font-medium text-terminal-green">{b.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-2xl font-semibold sm:text-3xl">Así trabajamos</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {pasos.map((paso, i) => (
              <li key={paso.titulo} className="rounded-xl border border-border bg-card p-5">
                <span className="flex size-8 items-center justify-center rounded-full bg-terminal-green/15 text-sm font-semibold text-terminal-green">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-medium">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {paso.texto}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-semibold sm:text-3xl">Preguntas frecuentes</h2>
          <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
            {preguntas.map((p) => (
              <details key={p.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {p.q}
                  <span
                    aria-hidden
                    className="text-terminal-green transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="scroll-mt-4 border-t border-border bg-card/40">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Cuéntanos de tu negocio
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Déjanos tus datos y te contactamos con una propuesta para tu
              página web, sin compromiso.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              ¿Prefieres escribirnos directo?
            </p>
            <WhatsAppLink
              zona="contacto"
              texto={TEXTO_WHATSAPP}
              className={`${botonSecundario} mt-3 w-full sm:w-auto`}
            >
              Abrir WhatsApp
            </WhatsAppLink>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <LeadForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Creativa Balam · Cozumel, Quintana Roo, México
          </span>
          <a
            href="mailto:hola@creativabalam.com.mx"
            className="py-2 hover:text-foreground"
          >
            hola@creativabalam.com.mx
          </a>
        </div>
      </footer>

      {/* Barra fija en celular: WhatsApp siempre a un toque */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <WhatsAppLink
          zona="barra-fija"
          texto={TEXTO_WHATSAPP}
          className={`${botonPrimario} w-full`}
        >
          Escríbenos por WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}
