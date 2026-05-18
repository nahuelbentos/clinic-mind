import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  content: z.string(),
  author: z.string().min(1),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.blogPost.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      author: true,
      date: true,
      tags: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { title, slug, description, content, author, date, tags, published } = parsed.data;

  const existing = await prisma.blogPost.findUnique({
    where: { userId_slug: { userId: session.user.id, slug } },
  });
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const post = await prisma.blogPost.create({
    data: {
      userId: session.user.id,
      title,
      slug,
      description,
      content,
      author,
      date: new Date(date),
      tags,
      published,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
