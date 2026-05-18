import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  content: z.string().optional(),
  author: z.string().min(1).optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

async function getOwnedPost(userId: string, id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post || post.userId !== userId) return null;
  return post;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await getOwnedPost(session.user.id, id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await getOwnedPost(session.user.id, id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { date, ...rest } = parsed.data;

  if (rest.slug && rest.slug !== existing.slug) {
    const conflict = await prisma.blogPost.findUnique({
      where: { userId_slug: { userId: session.user.id, slug: rest.slug } },
    });
    if (conflict) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      ...rest,
      ...(date ? { date: new Date(date) } : {}),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await getOwnedPost(session.user.id, id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.blogPost.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
