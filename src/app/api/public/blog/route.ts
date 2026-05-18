/**
 * GET /api/public/blog
 *
 * Query params:
 *   userId  (required) – owner user ID
 *   limit   (optional, default 20) – max posts to return
 *   offset  (optional, default 0)  – pagination offset
 *
 * Response: { posts: BlogPostPublic[], total: number }
 *   BlogPostPublic: { id, title, slug, description, author, date, tags }
 *
 * Only returns published posts. No authentication required.
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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userId");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400, headers: CORS });
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { userId, published: true },
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
      select: { id: true, title: true, slug: true, description: true, author: true, date: true, tags: true },
    }),
    prisma.blogPost.count({ where: { userId, published: true } }),
  ]);

  return NextResponse.json({ posts, total }, { headers: CORS });
}
