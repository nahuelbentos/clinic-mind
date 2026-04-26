"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { patientSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPatientAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    birthDate: formData.get("birthDate") as string,
    gender: formData.get("gender") as string,
    referredBy: formData.get("referredBy") as string,
    emergencyContact: formData.get("emergencyContact") as string,
    consultationReason: formData.get("consultationReason") as string,
    background: formData.get("background") as string,
    currentMedication: formData.get("currentMedication") as string,
    previousTherapy: formData.get("previousTherapy") as string,
    actValues: formData.get("actValues") as string,
  };

  const result = patientSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const db = getDb(session.user.id);
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
