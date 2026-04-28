import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";


export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Conocé a Micaela Vulcano: psicóloga especializada en Terapia de Aceptación y Compromiso (ACT). Su formación, enfoque y manera de acompañar.",
  openGraph: {
    title: "Sobre mí | Lic. Micaela Vulcano",
    description: "Conocé mi historia, formación y enfoque terapéutico basado en ACT.",
  },
};

const actPillars = [
  {
    title: "Aceptación",
    desc: "Aprender a hacer espacio para los pensamientos y emociones difíciles, sin luchar contra ellos ni dejar que te controlen.",
    color: "bg-sage-100 text-sage-700",
  },
  {
    title: "Defusión cognitiva",
    desc: "Tomar distancia de los pensamientos: observarlos como eventos mentales, no como verdades absolutas.",
    color: "bg-lilac-100 text-lilac-700",
  },
  {
    title: "Contacto con el presente",
    desc: "Vivir el momento actual con apertura y curiosidad, en lugar de quedar atrapado/a en el pasado o el futuro.",
    color: "bg-warm-100 text-warm-700",
  },
  {
    title: "El yo observador",
    desc: "Conectar con una parte de vos que puede observar los propios pensamientos y emociones sin identificarse con ellos.",
    color: "bg-cream-100 text-cream-700",
  },
  {
    title: "Valores",
    desc: "Clarificar qué es lo que más te importa en la vida: esas brújulas internas que guían tus decisiones.",
    color: "bg-sage-100 text-sage-700",
  },
  {
    title: "Acción comprometida",
    desc: "Actuar consistentemente en dirección a tus valores, incluso cuando aparece el miedo, la duda o el malestar.",
    color: "bg-lilac-100 text-lilac-700",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sage-50 to-warm-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo placeholder */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-3xl bg-gradient-to-br from-sage-200 to-lilac-200 flex items-center justify-center shadow-xl">
                {/* <div className="text-center">
                  <div className="text-7xl mb-2">👩‍⚕️</div>
                  <p className="text-warm-600 text-sm">Foto de Micaela</p>
                </div> */}
                <Image
                  src="/images/mica-2.jpeg"
                  alt="Micaela Vulcano"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover rounded-3xl"
                />

              </div>
            </div>
            {/* Text */}
            <div>
              <span className="inline-block bg-sage-100 text-sage-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
                Psicóloga · Mat. 78.517
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-warm-900 mb-5">
                Hola, soy Micaela
              </h1>
              <p className="text-warm-600 leading-relaxed mb-4">
                Soy psicóloga y me especialicé en la Terapia de Aceptación y Compromiso (ACT)
                porque creo que la salud mental no se trata de estar siempre bien — sino de
                aprender a vivir con todo lo que somos, incluidas las partes que duelen.
              </p>
              <p className="text-warm-600 leading-relaxed mb-4">
                Trabajo con adolescentes y adultos de manera virtual, en un espacio donde la
                honestidad, la calidez y el respeto son la base de cada sesión.
              </p>
              <p className="text-warm-600 leading-relaxed">
                Mi objetivo no es darte respuestas — es acompañarte a encontrar las tuyas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-warm-900 mb-8">Formación y experiencia</h2>
          <div className="space-y-5">
            {[
              {
                year: "2024",
                title: "Formación en Terapias Contextuales y de Tercera Ola",
                place: "Fundación Foro",
                detail: "Con foco en ACT, abordaje en niños y adolescentes, depresión, ansiedad, dolor crónico y consumos problemáticos.",
              },
              {
                year: "2021",
                title: "Diplomatura en Análisis Conductual Aplicado (ABA)",
                place: "UAI – Universidad Abierta Interamericana",
                detail: "Diseño, implementación y evaluación de intervenciones conductuales basadas en ABA.",
              },
              {
                year: "2021",
                title: "Licenciada en Psicología",
                place: "Universidad de Buenos Aires (UBA)",
                detail: "Título habilitante – Matrícula Nacional N.º 78.517",
              },
              {
                year: "2022–hoy",
                title: "Psicóloga en APND — Nuevo Enfoque de Bienestar Inclusivo",
                place: "Experiencia clínica",
                detail: "Trabajo interdisciplinario con enfoque individualizado para el bienestar de niños y adolescentes.",
              },
              {
                year: "2023–hoy",
                title: "Psicóloga clínica independiente",
                place: "Experiencia clínica",
                detail: "Especialización en terapias conductuales-contextuales (ACT y ABA). Atención a niños, adolescentes y adultos.",
              },
              {
                year: "Continua",
                title: "Supervisión clínica y formación continua",
                place: "Actualización permanente en terapias contextuales",
                detail: "",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5 pb-5 border-b border-warm-100 last:border-0">
                <span className="flex-shrink-0 text-sm text-sage-600 font-medium w-20 pt-1">{item.year}</span>
                <div>
                  <h3 className="font-semibold text-warm-800">{item.title}</h3>
                  <p className="text-warm-500 text-sm mt-0.5">{item.place}</p>
                  {item.detail && <p className="text-warm-400 text-xs mt-1 leading-relaxed">{item.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is ACT */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-warm-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-warm-900 mb-4">¿Qué es la terapia ACT?</h2>
            <p className="text-warm-500 max-w-2xl mx-auto leading-relaxed">
              La Terapia de Aceptación y Compromiso es una terapia de tercera generación basada
              en la evidencia. En lugar de pelear contra los pensamientos y emociones difíciles,
              ACT te enseña a relacionarte con ellos de otra manera — para que no te impidan
              vivir la vida que querés.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {actPillars.map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-2xl p-6 border border-warm-100 hover:shadow-sm transition-shadow">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${pillar.color}`}>
                  {pillar.title}
                </span>
                <p className="text-warm-600 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-sage-500 rounded-2xl p-8 text-white text-center">
            <p className="text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
              ACT no te promete que vas a dejar de sufrir. Te da herramientas para que el
              sufrimiento no sea el dueño de tu vida.
            </p>
            <Link
              href="/blog/que-es-la-terapia-act"
              className="inline-flex items-center gap-2 bg-white text-sage-700 hover:bg-sage-50 font-medium px-6 py-3 rounded-full transition-colors text-sm"
            >
              Leer más sobre ACT en el blog →
            </Link>
          </div>
        </div>
      </section>

      {/* My approach */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-warm-900 mb-6">Mi manera de trabajar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "🤝", title: "Vínculo genuino", desc: "La relación terapéutica es el motor del cambio. Trabajamos desde la confianza real." },
              { icon: "🎯", title: "Sin rodeos", desc: "Conversaciones honestas, sin tecnicismos innecesarios, con foco en lo que importa." },
              { icon: "🌀", title: "A tu ritmo", desc: "Cada proceso es único. No hay cronograma fijo ni metas arbitrarias." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl bg-warm-50 border border-warm-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-warm-800 mb-2 text-sm">{item.title}</h3>
                <p className="text-warm-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-sage-500 hover:bg-sage-600 text-white font-medium px-7 py-3.5 rounded-full transition-colors shadow-md"
            >
              Hablemos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
