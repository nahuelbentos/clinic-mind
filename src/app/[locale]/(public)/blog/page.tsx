import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre salud mental, Terapia de Aceptación y Compromiso (ACT), bienestar emocional y psicología para la vida cotidiana.",
  openGraph: {
    title: "Blog | Lic. Micaela Vulcano",
    description: "Artículos sobre salud mental, ACT y bienestar emocional.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-warm-50 to-lilac-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-warm-100 text-warm-700 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            Artículos
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-warm-900 mb-5">Blog</h1>
          <p className="text-warm-500 text-lg leading-relaxed">
            Reflexiones, herramientas y lecturas para acompañar tu bienestar emocional.
            Sin tecnicismos, con honestidad.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-warm-400 py-20">Próximamente...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-warm-50 hover:bg-brand-50 rounded-2xl p-6 border border-warm-100 hover:border-brand-200 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <time className="text-xs text-warm-400" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    {post.tags && post.tags[0] && (
                      <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                        {post.tags[0]}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-warm-900 mb-2 group-hover:text-brand-700 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-warm-500 text-sm leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-600 text-sm font-medium mt-4">
                    Leer artículo
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-warm-50">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-warm-900 mb-3">¿Querés saber más?</h2>
          <p className="text-warm-500 mb-8">
            Si tenés dudas sobre el proceso terapéutico o simplemente querés conversar, estoy disponible.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-medium px-7 py-3.5 rounded-full transition-colors shadow-md"
          >
            Escribime
          </Link>
        </div>
      </section>
    </>
  );
}
