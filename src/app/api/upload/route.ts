import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
] as const;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formato de solicitud inválido" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  const type = file.type as string;
  if (!(ALLOWED_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido. Se aceptan: JPEG, PNG, WebP, MP4" },
      { status: 400 }
    );
  }

  const maxSize = type === "video/mp4" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    const limitMB = maxSize / (1024 * 1024);
    return NextResponse.json(
      { error: `El archivo excede el límite de ${limitMB}MB` },
      { status: 400 }
    );
  }

  const fileName = file instanceof File ? file.name : `upload.${type.split("/")[1]}`;
  const pathname = `feedback/${session.user.id}/${Date.now()}-${fileName}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("Blob upload failed:", e);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}
