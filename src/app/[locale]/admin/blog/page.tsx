import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";

export const metadata = { title: "Blog — Admin" };

export default async function AdminBlogPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const posts = await prisma.blogPost.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      date: true,
      published: true,
      tags: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Artículos del blog</h1>
          <p className="text-sm text-warm-500 mt-1">{posts.length} artículo{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo artículo
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-warm-200 py-20 text-center">
          <p className="text-warm-400 mb-4">No hay artículos todavía.</p>
          <Link
            href="/admin/blog/nuevo"
            className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 text-sm font-medium transition"
          >
            Crear el primero →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-warm-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-100 bg-warm-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wider">Título</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wider hidden md:table-cell">Fecha</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-warm-50 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-warm-900 leading-snug">{post.title}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-sage-50 text-sage-600 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-warm-500 font-mono hidden md:table-cell">{post.slug}</td>
                  <td className="px-5 py-3.5 text-warm-500 hidden md:table-cell">
                    {new Date(post.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      post.published
                        ? "bg-sage-100 text-sage-700"
                        : "bg-warm-100 text-warm-600"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-sage-500" : "bg-warm-400"}`} />
                      {post.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/blog/${post.id}/editar`}
                      className="text-sage-600 hover:text-sage-700 font-medium text-sm transition"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
