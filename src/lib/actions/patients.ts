"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { patientSchema } from "@/lib/validations";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPatientAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const rawEntries = Object.fromEntries(formData.entries());
  const raw = Object.fromEntries(
    Object.entries(rawEntries).map(([k, v]) => [k, v === null ? undefined : v])
  );

  const result = patientSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const db = getDb(session.user.id);

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });
  const limit = PLAN_LIMITS[user?.plan ?? "FREE"]?.maxPatients ?? 5;
  const count = await db.patient.count({
    where: { userId: session.user.id, deletedAt: null },
  });
  if (count >= limit) {
    return {
      error:
        "Alcanzaste el límite de pacientes de tu plan Free. Actualizá a Pro para continuar.",
    };
  }

  const patient = await db.patient.create({
    data: {
      userId: session.user.id,
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email || null,
      phone: result.data.phone || null,
      birthDate: result.data.birthDate
        ? new Date(result.data.birthDate)
        : null,
      gender: result.data.gender || null,
      referredBy: result.data.referredBy || null,
      emergencyContact: result.data.emergencyContact || null,
      clinicalProfile: {
        create: {
          consultationReason: result.data.consultationReason || null,
          background: result.data.background || null,
          currentMedication: result.data.currentMedication || null,
          previousTherapy: result.data.previousTherapy || null,
          actValues: result.data.actValues || null,
          disabilityType: result.data.disabilityType || null,
          autonomyLevel: result.data.autonomyLevel || null,
          integrationContext: result.data.integrationContext || null,
        },
      },
    },
  });

  revalidatePath("/dashboard/pacientes");
  redirect(`/dashboard/pacientes/${patient.id}`);
}

export async function updatePatientStatusAction(
  patientId: string,
  status: "ACTIVE" | "PAUSED" | "DISCHARGED"
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const db = getDb(session.user.id);
  await db.patient.update({
    where: { id: patientId, userId: session.user.id },
    data: { status },
  });

  revalidatePath(`/dashboard/pacientes/${patientId}`);
  revalidatePath("/dashboard/pacientes");
}

export async function deletePatient(patientId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const canDelete = await isFeatureEnabled("DELETE_PATIENTS", session.user.id);
  if (!canDelete)
    return { error: "No tienes permiso para eliminar pacientes" };

  const db = getDb(session.user.id);
  const patient = await db.patient.findFirst({
    where: { id: patientId, userId: session.user.id },
  });
  if (!patient) return { error: "Paciente no encontrado" };

  await db.patient.update({
    where: { id: patientId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard/pacientes");
  return { success: true };
}
