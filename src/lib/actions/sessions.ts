"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { sessionSchema } from "@/lib/validations";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSessionAction(
  patientId: string,
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const raw = {
    date: formData.get("date") as string,
    duration: formData.get("duration") as string,
    sessionNumber: formData.get("sessionNumber") as string,
    status: formData.get("status") as string,
    notes: formData.get("notes") as string,
    nextSessionGoal: formData.get("nextSessionGoal") as string,
    paymentStatus: formData.get("paymentStatus") as string,
    paymentAmount: formData.get("paymentAmount") as string,
    meetLink: formData.get("meetLink") as string,
    meetProvider: formData.get("meetProvider") as string,
  };

  const result = sessionSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const db = getDb(session.user.id);

  // Verify patient belongs to user
  const patient = await db.patient.findFirst({
    where: { id: patientId, userId: session.user.id },
  });
  if (!patient) return { error: "Paciente no encontrado" };

  const meetLinkValue = result.data.meetLink || null;
  await db.session.create({
    data: {
      patientId,
      date: new Date(result.data.date),
      duration: result.data.duration,
      sessionNumber: result.data.sessionNumber,
      status: result.data.status,
      notes: result.data.notes || null,
      nextSessionGoal: result.data.nextSessionGoal || null,
      paymentStatus: result.data.paymentStatus,
      paymentAmount: result.data.paymentAmount || null,
      meetLink: meetLinkValue,
      meetProvider: meetLinkValue ? (result.data.meetProvider || null) : null,
    },
  });

  revalidatePath(`/dashboard/pacientes/${patientId}`);
  redirect(`/dashboard/pacientes/${patientId}`);
}

export async function deleteSession(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const canDelete = await isFeatureEnabled("DELETE_SESSIONS", session.user.id);
  if (!canDelete) return { error: "No tienes permiso para eliminar sesiones" };

  const db = getDb(session.user.id);
  const record = await db.session.findFirst({
    where: { id: sessionId, patient: { userId: session.user.id } },
  });
  if (!record) return { error: "Sesión no encontrada" };

  await db.session.update({
    where: { id: sessionId },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/dashboard/pacientes/${record.patientId}`);
  return { success: true };
}
