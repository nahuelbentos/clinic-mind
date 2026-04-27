"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { reportSchema } from "@/lib/validations";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReportAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const patientId = formData.get("patientId") as string;
  if (!patientId) return { error: "Paciente requerido" };

  const raw = {
    periodStart: formData.get("periodStart") as string,
    periodEnd: formData.get("periodEnd") as string,
    area: formData.get("area") as string,
    progressScale: formData.get("progressScale") as string,
    observations: formData.get("observations") as string,
    recommendations: formData.get("recommendations") as string,
    nextObjectives: formData.get("nextObjectives") as string,
  };

  const result = reportSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const db = getDb(session.user.id);

  const patient = await db.patient.findFirst({
    where: { id: patientId, userId: session.user.id, deletedAt: null },
  });
  if (!patient) return { error: "Paciente no encontrado" };

  const report = await db.report.create({
    data: {
      patientId,
      periodStart: new Date(result.data.periodStart),
      periodEnd: new Date(result.data.periodEnd),
      area: result.data.area,
      progressScale: result.data.progressScale,
      observations: result.data.observations,
      recommendations: result.data.recommendations,
      nextObjectives: result.data.nextObjectives,
    },
  });

  revalidatePath(`/dashboard/pacientes/${patientId}`);
  redirect(`/dashboard/pacientes/${patientId}/informes/${report.id}`);
}

export async function deleteReportAction(reportId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const canDelete = await isFeatureEnabled("DELETE_REPORTS", session.user.id);
  if (!canDelete) return { error: "No tienes permiso para eliminar informes" };

  const db = getDb(session.user.id);

  const report = await db.report.findFirst({
    where: { id: reportId, deletedAt: null },
    include: { patient: { select: { userId: true } } },
  });
  if (!report || report.patient.userId !== session.user.id)
    return { error: "Informe no encontrado" };

  await db.report.update({
    where: { id: reportId },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/dashboard/pacientes/${report.patientId}`);
  return { success: true };
}
