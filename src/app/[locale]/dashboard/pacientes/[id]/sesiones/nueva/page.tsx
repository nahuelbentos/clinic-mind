import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import NuevaSesionForm from "./_form";

export default async function NuevaSesionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: patientId } = await params;
  const session = await auth();
  if (!session?.user?.id) return null;

  const db = getDb(session.user.id);
  const patient = await db.patient.findFirst({
    where: { id: patientId, userId: session.user.id },
    select: { meetLink: true, meetProvider: true, defaultAmount: true },
  });

  return <NuevaSesionForm patientId={patientId} patientDefaults={patient} />;
}
