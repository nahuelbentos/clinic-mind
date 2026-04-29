import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Psicóloga especializada en Terapia de Aceptación y Compromiso (ACT). Atención virtual para adolescentes y adultos. Comenzá tu proceso hoy.",
};

const pillars = [
  {
    icon: "🌿",
    title: "Terapia basada en evidencia",
    desc: "La ACT es una de las terapias de tercera generación con mayor respaldo científico para el tratamiento de ansiedad, depresión y más.",
  },
  {
    icon: "💻",
    title: "100% virtual",
    desc: "Sesiones por videollamada desde la comodidad de tu hogar. Sin traslados, con la misma calidez y profesionalismo.",
  },
  {
    icon: "🌸",
    title: "Espacio seguro",
    desc: "Un lugar sin juicios donde podés explorar lo que sentís, con acompañamiento real y herramientas concretas.",
  },
  {
    icon: "🧭",
    title: "Enfoque en tus valores",
    desc: "No se trata de eliminar el malestar, sino de construir una vida con sentido, alineada con lo que más te importa.",
  },
];

const steps = [
  { n: "01", title: "Primer contacto", desc: "Me escribís por WhatsApp y coordinamos una primera consulta sin compromiso." },
  { n: "02", title: "Sesión inicial", desc: "Conversamos sobre lo que estás atravesando y evaluamos si el proceso terapéutico es lo que necesitás." },
  { n: "03", title: "Tu proceso", desc: "Trabajamos juntas/os a tu ritmo, con herramientas prácticas y un espacio de genuino acompañamiento." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-50 via-warm-50 to-lilac-50 min-h-[90vh] flex items-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-lilac-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="inline-block bg-brand-100 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                Psicología · Terapia ACT · Online
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-900 leading-tight mb-6">
                Construí una vida{" "}
                <span className="text-brand-600">que valga la pena</span>{" "}
                vivir
              </h1>
              <p className="text-lg text-warm-600 leading-relaxed mb-8 max-w-lg">
                Soy Micaela Vulcano, psicóloga especializada en Terapia de Aceptación y
                Compromiso. Acompaño a adolescentes y adultos en procesos de bienestar
                real — no de felicidad forzada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="https://wa.me/5491100000000?text=Hola%20Micaela%2C%20quiero%20consultar%20sobre%20una%20primera%20sesi%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-medium px-7 py-3.5 rounded-full transition-colors shadow-md hover:shadow-lg text-base"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Escribime por WhatsApp
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-warm-50 text-warm-700 font-medium px-7 py-3.5 rounded-full border border-warm-200 transition-colors text-base"
                >
                  Conocé más sobre mí
                </Link>
              </div>
            </div>

            {/* Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full border border-warm-100">
                <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
                  🌱
                </div>
                <h2 className="text-center text-xl font-semibold text-warm-800 mb-3">
                  ¿Es para vos?
                </h2>
                <ul className="space-y-3">
                  {[
                    "Sentís que la ansiedad te frena",
                    "Querés entender tus emociones",
                    "Buscás vivir con más sentido",
                    "Necesitás un espacio propio",
                    "Querés herramientas reales",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-warm-600 text-sm">
                      <span className="mt-0.5 w-5 h-5 flex-shrink-0 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/servicios"
                  className="mt-6 block text-center text-brand-600 hover:text-brand-700 text-sm font-medium underline underline-offset-2"
                >
                  Ver servicios →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-warm-900 mb-4">¿Por qué terapia ACT?</h2>
            <p className="text-warm-500 max-w-xl mx-auto">
              La Terapia de Aceptación y Compromiso no busca hacer desaparecer el dolor —
              te ayuda a relacionarte de otra manera con él.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="bg-warm-50 rounded-2xl p-6 border border-warm-100 hover:border-brand-200 hover:shadow-sm transition-all duration-200">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-semibold text-warm-800 mb-2 text-base">{p.title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-warm-900 mb-4">¿Cómo empezamos?</h2>
            <p className="text-warm-500">Simple, sin trámites. Solo el primer paso.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 bg-brand-500 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.n}
                </div>
                <h3 className="font-semibold text-warm-800 mb-2">{s.title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="https://wa.me/5491100000000?text=Hola%20Micaela%2C%20quiero%20consultar%20sobre%20una%20primera%20sesi%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-medium px-8 py-3.5 rounded-full transition-colors shadow-md text-base"
            >
              Agendá tu primera consulta
            </Link>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-lilac-100 to-brand-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-warm-900 mb-4">
            El cambio empieza con una conversación
          </h2>
          <p className="text-warm-600 mb-8 text-lg">
            No necesitás estar en crisis para buscar ayuda. Podés empezar cuando lo sentís.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://wa.me/5491100000000?text=Hola%20Micaela%2C%20quiero%20consultar%20sobre%20una%20primera%20sesi%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-medium px-7 py-3.5 rounded-full transition-colors shadow-md text-base"
            >
              Escribime ahora
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 bg-white/80 hover:bg-white text-warm-700 font-medium px-7 py-3.5 rounded-full border border-warm-200 transition-colors text-base"
            >
              Leer el blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
