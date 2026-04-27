"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { goalSchema } from "@/lib/validations";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGoalAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const patientId = formData.get("patientId") as string;
  if (!patientId) return { error: "Paciente requerido" };

  const raw = {
    description: formData.get("description") as string,
    area: formData.get("area") as string,
    targetDate: formData.get("targetDate") as string,
    notes: formData.get("notes") as string,
  };

  const result = goalSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const db = getDb(session.user.id);

  const patient = await db.patient.findFirst({
    where: { id: patientId, userId: session.user.id, deletedAt: null },
  });
  if (!patient) return { error: "Paciente no encontrado" };

  await db.goal.create({
    data: {
      patientId,
      description: result.data.description,
      area: result.data.area,
      targetDate: result.data.targetDate
        ? new Date(result.data.targetDate)
        : null,
      notes: result.data.notes || null,
    },
  });

  revalidatePath(`/dashboard/pacientes/${patientId}`);
  redirect(`/dashboard/pacientes/${patientId}`);
}

export async function updateGoalStatusAction(
  goalId: string,
  status: "PENDING" | "IN_PROGRESS" | "ACHIEVED"
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const db = getDb(session.user.id);

  const goal = await db.goal.findFirst({
    where: { id: goalId, deletedAt: null },
    include: { patient: { select: { userId: true } } },
  });
  if (!goal || goal.patient.userId !== session.user.id)
    return { error: "Objetivo no encontrado" };

  await db.goal.update({ where: { id: goalId }, data: { status } });
  revalidatePath(`/dashboard/pacientes/${goal.patientId}`);
  return { success: true };
}

export async function deleteGoalAction(goalId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const canDelete = await isFeatureEnabled("DELETE_GOALS", session.user.id);
  if (!canDelete) return { error: "No tienes permiso para eliminar objetivos" };

  const db = getDb(session.user.id);

  const goal = await db.goal.findFirst({
    where: { id: goalId, deletedAt: null },
    include: { patient: { select: { userId: true } } },
  });
  if (!goal || goal.patient.userId !== session.user.id)
    return { error: "Objetivo no encontrado" };

  await db.goal.update({
    where: { id: goalId },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/dashboard/pacientes/${goal.patientId}`);
  return { success: true };
}
