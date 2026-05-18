/**
 * GET /api/public/blog/[slug]
 *
 * Query params:
 *   userId  (required) – owner user ID
 *
 * Response: BlogPostFull | 404
 *   BlogPostFull: { id, title, slug, description, content, author, date, tags }
 *
 * Only returns the post if published: true. No authentication required.
 */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userId");
  const { slug } = await params;

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400, headers: CORS });
  }

  const post = await prisma.blogPost.findUnique({
    where: { userId_slug: { userId, slug } },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      author: true,
      date: true,
      tags: true,
      published: true,
    },
  });

  if (!post || !post.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
  }

  return NextResponse.json(post, { headers: CORS });
}
