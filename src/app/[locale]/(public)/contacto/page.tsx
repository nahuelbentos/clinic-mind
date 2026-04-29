import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá a la Lic. Micaela Vulcano para consultar sobre el proceso terapéutico o agendar una primera sesión. Atención virtual para adolescentes y adultos.",
  openGraph: {
    title: "Contacto | Lic. Micaela Vulcano",
    description: "Consultá sobre el proceso terapéutico o agendá una primera sesión.",
  },
};

export default function ContactoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sage-50 to-warm-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-sage-100 text-sage-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            Estoy aquí
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-warm-900 mb-5">Contacto</h1>
          <p className="text-warm-500 text-lg leading-relaxed max-w-xl mx-auto">
            El primer paso es el más importante. Podés escribirme directamente por WhatsApp
            o usar el formulario — te respondo a la brevedad.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Direct contact */}
          <div>
            <h2 className="text-2xl font-bold text-warm-900 mb-6">Vías de contacto</h2>

            {/* WhatsApp primary */}
            <Link
              href="https://wa.me/5491100000000?text=Hola%20Micaela%2C%20quiero%20consultar%20sobre%20una%20primera%20sesi%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-2xl p-5 mb-4 transition-colors group"
            >
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-warm-900 group-hover:text-sage-700 transition-colors">WhatsApp</p>
                <p className="text-warm-500 text-sm">La vía más rápida — respondo en el día</p>
              </div>
              <svg className="w-5 h-5 text-warm-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Info boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {[
                { icon: "📅", title: "Días de atención", val: "Lunes a Viernes" },
                { icon: "💻", title: "Modalidad", val: "100% virtual" },
                { icon: "⏱️", title: "Duración", val: "50 minutos" },
                { icon: "🕐", title: "Respuesta", val: "En el día hábil" },
              ].map((item) => (
                <div key={item.title} className="bg-warm-50 rounded-xl p-4 border border-warm-100">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-xs text-warm-400 uppercase tracking-wide">{item.title}</p>
                  <p className="text-sm font-medium text-warm-800 mt-0.5">{item.val}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-sage-50 rounded-2xl p-5 border border-sage-100">
              <p className="text-warm-600 text-sm leading-relaxed">
                <span className="font-medium text-warm-800">Antes de escribir:</span> No hace falta
                que tengas claro qué querés trabajar. Podemos hablar primero y ver juntos si el
                proceso terapéutico es lo que necesitás.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <h2 className="text-2xl font-bold text-warm-900 mb-6">Formulario de contacto</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
