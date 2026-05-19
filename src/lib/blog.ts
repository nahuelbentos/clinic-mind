// Fuente de datos migrada de archivos MDX locales a Prisma/PostgreSQL.
// BLOG_OWNER_USER_ID identifica al único dueño del blog público (Lic. Micaela Vulcano).
// En un futuro multi-tenant, este valor se reemplazaría por el userId del profesional
// cuyo sitio público esté siendo visitado.
import { prisma } from "@/lib/prisma";

const OWNER_ID = process.env.BLOG_OWNER_USER_ID ?? "";

export interface PostMeta {
  title: string;
  date: string;
  description: string;
  slug: string;
  author: string;
  tags?: string[];
}

export interface Post extends PostMeta {
  content: string;
}

export async function getAllPosts(): Promise<PostMeta[]> {
  if (!OWNER_ID) {
    console.warn("[blog] BLOG_OWNER_USER_ID no definido. No se mostrarán artículos.");
    return [];
  }

  const posts = await prisma.blogPost.findMany({
    where: { userId: OWNER_ID, published: true },
    orderBy: { date: "desc" },
    select: {
      title: true,
      date: true,
      description: true,
      slug: true,
      author: true,
      tags: true,
    },
  });

  return posts.map((p) => ({
    title: p.title,
    date: p.date.toISOString(),
    description: p.description,
    slug: p.slug,
    author: p.author,
    tags: p.tags,
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!OWNER_ID) {
    console.warn("[blog] BLOG_OWNER_USER_ID no definido. No se mostrarán artículos.");
    return null;
  }

  const post = await prisma.blogPost.findUnique({
    where: { userId_slug: { userId: OWNER_ID, slug } },
  });

  if (!post || !post.published) return null;

  return {
    title: post.title,
    date: post.date.toISOString(),
    description: post.description,
    slug: post.slug,
    author: post.author,
    tags: post.tags,
    content: post.content,
  };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
