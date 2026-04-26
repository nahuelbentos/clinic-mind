"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { appointmentSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createAppointmentAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const raw = {
    patientId: formData.get("patientId") as string,
    scheduledAt: formData.get("scheduledAt") as string,
  };

  const result = appointmentSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const db = getDb(session.user.id);

  // Verify patient belongs to user
  const patient = await db.patient.findFirst({
    where: { id: result.data.patientId, userId: session.user.id },
  });
  if (!patient) return { error: "Paciente no encontrado" };

  await db.appointment.create({
    data: {
      patientId: result.data.patientId,
      scheduledAt: new Date(result.data.scheduledAt),
    },
  });

  revalidatePath("/dashboard/citas");
  revalidatePath(`/dashboard/pacientes/${result.data.patientId}`);
  return { success: true };
}

export async function cancelAppointmentAction(appointmentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const db = getDb(session.user.id);

  const appointment = await db.appointment.findFirst({
    where: { id: appointmentId, patient: { userId: session.user.id } },
  });
  if (!appointment) return { error: "Cita no encontrada" };

  await db.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/dashboard/citas");
  revalidatePath(`/dashboard/pacientes/${appointment.patientId}`);
}
