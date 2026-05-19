import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import BlogForm from "@/components/admin/BlogForm";

export const metadata = { title: "Editar artículo — Dashboard" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DashboardBlogEditarPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post || post.userId !== session.user.id) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/blog"
          className="inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-700 transition mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al blog
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">Editar artículo</h1>
        <p className="text-sm text-warm-500 mt-1 font-mono">{post.slug}</p>
      </div>
      <BlogForm
        mode="edit"
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          description: post.description,
          content: post.content,
          author: post.author,
          date: post.date.toISOString().slice(0, 10),
          tags: post.tags,
          published: post.published,
        }}
      />
    </div>
  );
}
