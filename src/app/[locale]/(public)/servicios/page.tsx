import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Sesiones de psicoterapia virtual con ACT para adolescentes y adultos. Conocé cómo funciona el proceso, frecuencia, duración y valores de consulta.",
  openGraph: {
    title: "Servicios | Lic. Micaela Vulcano",
    description: "Sesiones de psicoterapia virtual con ACT para adolescentes y adultos.",
  },
};

const process = [
  {
    n: "01",
    title: "Me escribís",
    desc: "Por WhatsApp o el formulario de contacto. Te respondo a la brevedad para coordinar.",
  },
  {
    n: "02",
    title: "Primera consulta",
    desc: "Una sesión inicial sin compromiso para conocernos, entender qué te trae y evaluar si el proceso terapéutico es lo que necesitás.",
  },
  {
    n: "03",
    title: "Encuadre de trabajo",
    desc: "Definimos juntos/as frecuencia, objetivos iniciales y todo lo que necesitás saber antes de empezar.",
  },
  {
    n: "04",
    title: "Proceso terapéutico",
    desc: "Sesiones semanales o quincenales, con herramientas prácticas de ACT adaptadas a vos.",
  },
  {
    n: "05",
    title: "Seguimiento y cierre",
    desc: "Evaluamos el proceso de forma continua. El cierre lo decidimos juntos, cuando sea el momento.",
  },
];

const faqs = [
  {
    q: "¿Cuánto dura cada sesión?",
    a: "Las sesiones tienen una duración de 50 minutos, en modalidad virtual por videollamada (Google Meet, Zoom o plataforma que prefieras).",
  },
  {
    q: "¿Con qué frecuencia se trabaja?",
    a: "Generalmente comenzamos con sesiones semanales. Dependiendo del proceso, podemos espaciarlas a quincenal con el tiempo.",
  },
  {
    q: "¿Atendés adolescentes?",
    a: "Sí, trabajo con adolescentes a partir de los 13 años. Si sos padre/madre/tutor/a, podemos coordinar una consulta inicial para conversar antes de la primera sesión.",
  },
  {
    q: "¿Cómo son los pagos?",
    a: "Los valores y métodos de pago los acordamos directamente. Podés consultarme por WhatsApp para obtener la información actualizada.",
  },
  {
    q: "¿Hacés interconsultas o derivaciones?",
    a: "Sí, de ser necesario puedo coordinar con psiquiatras u otros profesionales de salud para un abordaje integral.",
  },
];

export default function ServiciosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-lilac-50 to-warm-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-lilac-100 text-lilac-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            Sesiones virtuales
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-warm-900 mb-5">
            Servicios
          </h1>
          <p className="text-warm-500 text-lg leading-relaxed">
            Atención psicológica individual, online, con un enfoque basado en la evidencia
            y un acompañamiento genuino.
          </p>
        </div>
      </section>

      {/* Services cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adults */}
            <div className="bg-warm-50 rounded-3xl p-8 border border-warm-100">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-2xl mb-5">
                🧑
              </div>
              <h2 className="text-xl font-bold text-warm-900 mb-3">Adultos</h2>
              <p className="text-warm-600 text-sm leading-relaxed mb-5">
                Acompañamiento para atravesar momentos difíciles, trabajar ansiedad, estrés,
                tristeza, crisis vitales o simplemente construir una vida con más sentido.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Ansiedad y preocupación excesiva",
                  "Tristeza y estados depresivos",
                  "Crisis de identidad o etapas vitales",
                  "Dificultades en relaciones",
                  "Burnout y agotamiento",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-warm-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="https://wa.me/5491100000000?text=Hola%20Micaela%2C%20quiero%20consultar%20para%20adultos."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
              >
                Consultar
              </Link>
            </div>

            {/* Adolescents */}
            <div className="bg-warm-50 rounded-3xl p-8 border border-warm-100">
              <div className="w-14 h-14 bg-lilac-100 rounded-2xl flex items-center justify-center text-2xl mb-5">
                🧒
              </div>
              <h2 className="text-xl font-bold text-warm-900 mb-3">Adolescentes</h2>
              <p className="text-warm-600 text-sm leading-relaxed mb-5">
                Un espacio propio para adolescentes (13+) donde pueden hablar de lo que les
                pasa sin filtros, con una profesional que los escucha sin juzgar.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Autoestima e imagen personal",
                  "Vínculos y relaciones sociales",
                  "Ansiedad ante el rendimiento",
                  "Identidad y orientación",
                  "Familia y entornos difíciles",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-warm-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-lilac-400 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="https://wa.me/5491100000000?text=Hola%20Micaela%2C%20quiero%20consultar%20sobre%20atenci%C3%B3n%20para%20adolescentes."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-lilac-500 hover:bg-lilac-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
              >
                Consultar
              </Link>
            </div>
          </div>

          {/* Session details */}
          <div className="mt-10 bg-brand-50 rounded-3xl p-8 border border-brand-100">
            <h3 className="font-bold text-warm-900 mb-6 text-lg">Detalles de la sesión</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { icon: "⏱️", label: "Duración", value: "50 minutos" },
                { icon: "💻", label: "Modalidad", value: "100% virtual" },
                { icon: "📅", label: "Frecuencia", value: "Semanal / Quincenal" },
                { icon: "💳", label: "Arancel", value: "Consultar por WA" },
              ].map((d) => (
                <div key={d.label} className="text-center">
                  <div className="text-2xl mb-2">{d.icon}</div>
                  <div className="text-xs text-warm-500 uppercase tracking-wide mb-1">{d.label}</div>
                  <div className="text-sm font-medium text-warm-800">{d.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-warm-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-warm-900 mb-3">Cómo funciona el proceso</h2>
            <p className="text-warm-500">Paso a paso, sin apuros.</p>
          </div>
          <div className="relative">
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-warm-200 hidden sm:block" />
            <div className="space-y-8">
              {process.map((step) => (
                <div key={step.n} className="relative flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                    {step.n}
                  </div>
                  <div className="pt-3">
                    <h3 className="font-semibold text-warm-800 mb-1">{step.title}</h3>
                    <p className="text-warm-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-warm-900 mb-10 text-center">Preguntas frecuentes</h2>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-warm-50 rounded-2xl p-6 border border-warm-100">
                <h3 className="font-semibold text-warm-800 mb-2">{faq.q}</h3>
                <p className="text-warm-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-500">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-4">¿Querés empezar?</h2>
          <p className="text-brand-100 mb-8">
            Escribime y coordinamos una primera consulta sin compromiso.
          </p>
          <Link
            href="https://wa.me/5491100000000?text=Hola%20Micaela%2C%20quiero%20consultar%20sobre%20una%20primera%20sesi%C3%B3n."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-brand-50 font-medium px-7 py-3.5 rounded-full transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar por WhatsApp
          </Link>
        </div>
      </section>
    </>
  );
}
