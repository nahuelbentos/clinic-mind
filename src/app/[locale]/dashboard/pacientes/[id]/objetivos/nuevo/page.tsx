import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import NuevoObjetivoForm from "./_form";

export default async function NuevoObjetivoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ parentId?: string }>;
}) {
  const { id: patientId } = await params;
  const { parentId } = await searchParams;

  let parentDescription: string | null = null;
  if (parentId) {
    const session = await auth();
    if (session?.user?.id) {
      const db = getDb(session.user.id);
      const parent = await db.goal.findFirst({
        where: {
          id: parentId,
          patientId,
          deletedAt: null,
          parentId: null,
          patient: { userId: session.user.id },
        },
        select: { description: true },
      });
      parentDescription = parent?.description ?? null;
    }
  }

  return (
    <NuevoObjetivoForm
      patientId={patientId}
      parentId={parentDescription ? parentId ?? null : null}
      parentDescription={parentDescription}
    />
  );
}
