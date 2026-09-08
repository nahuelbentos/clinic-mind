import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy autenticado para adjuntos de feedback.
 *
 * Los archivos se suben a Vercel Blob con `access: "private"` (ver
 * `src/app/api/upload/route.ts`), por lo que su URL directa devuelve 403.
 * Esta route valida que quien pide sea un ADMIN logueado y streamea el blob.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }

  const rawUrl = request.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Falta el parámetro url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }

  // Solo blobs de Vercel y solo dentro del prefijo de feedback.
  if (
    !parsed.hostname.endsWith(".blob.vercel-storage.com") ||
    !parsed.pathname.startsWith("/feedback/")
  ) {
    return NextResponse.json({ error: "URL no permitida" }, { status: 400 });
  }

  try {
    const result = await get(parsed.toString(), { access: "private" });
    if (!result || result.statusCode !== 200) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        "Content-Length": String(result.blob.size),
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (e) {
    console.error("Feedback attachment proxy failed:", e);
    return NextResponse.json(
      { error: "Error al obtener el archivo" },
      { status: 500 },
    );
  }
}
