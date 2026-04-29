import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: "Artículo no encontrado" };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-brand-50 to-warm-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-warm-500 hover:text-brand-600 text-sm mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al blog
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <time className="text-sm text-warm-400" dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            {post.tags?.map((tag) => (
              <span key={tag} className="text-xs bg-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-900 leading-tight mb-5">
            {post.title}
          </h1>
          <p className="text-warm-500 text-lg leading-relaxed">{post.description}</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose prose-warm max-w-none
          prose-headings:font-bold prose-headings:text-warm-900
          prose-p:text-warm-700 prose-p:leading-relaxed
          prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-warm-800
          prose-ul:text-warm-700 prose-ol:text-warm-700
          prose-li:my-1
          prose-blockquote:border-l-brand-400 prose-blockquote:text-warm-600 prose-blockquote:bg-brand-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
          prose-hr:border-warm-200
          prose-code:text-brand-700 prose-code:bg-brand-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
          <MDXRemote source={post.content} />
        </div>

        {/* Author card */}
        <div className="mt-16 pt-10 border-t border-warm-100">
          <div className="bg-brand-50 rounded-2xl p-6 flex gap-5 items-start">
            <div className="w-14 h-14 bg-brand-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              👩‍⚕️
            </div>
            <div>
              <p className="text-xs text-warm-400 uppercase tracking-wide mb-1">Escrito por</p>
              <h3 className="font-semibold text-warm-900 mb-1">Lic. Micaela Vulcano</h3>
              <p className="text-warm-500 text-sm leading-relaxed">
                Psicóloga especializada en Terapia de Aceptación y Compromiso (ACT).
                Atención virtual para adolescentes y adultos.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-medium mt-2 transition-colors"
              >
                Conocé más →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-lilac-50 to-brand-50 rounded-2xl p-8 text-center border border-warm-100">
          <h3 className="font-bold text-warm-900 text-xl mb-3">
            ¿Querés empezar tu proceso?
          </h3>
          <p className="text-warm-500 text-sm mb-6">
            Podemos tener una primera consulta sin compromiso para ver si es lo que necesitás.
          </p>
          <Link
            href="https://wa.me/5491100000000?text=Hola%20Micaela%2C%20le%C3%AD%20tu%20blog%20y%20quiero%20consultar%20sobre%20el%20proceso%20terap%C3%A9utico."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-medium px-6 py-3 rounded-full transition-colors shadow-md"
          >
            Escribime por WhatsApp
          </Link>
        </div>

        {/* Back */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="text-warm-400 hover:text-warm-600 text-sm transition-colors"
          >
            ← Ver todos los artículos
          </Link>
        </div>
      </div>
    </article>
  );
}
