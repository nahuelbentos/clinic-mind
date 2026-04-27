"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}

export async function toggleUserActive(userId: string): Promise<void> {
  if (!(await requireAdmin())) throw new Error("No autorizado");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isActive: true },
  });
  if (!user) throw new Error("Usuario no encontrado");
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });
  revalidatePath("/admin/terapeutas");
}

export async function updateUserPlanAction(formData: FormData): Promise<void> {
  if (!(await requireAdmin())) throw new Error("No autorizado");
  const userId = formData.get("userId") as string;
  const plan = formData.get("plan") as "FREE" | "PRO";
  await prisma.user.update({ where: { id: userId }, data: { plan } });
  revalidatePath("/admin/terapeutas");
}

export async function toggleFeatureFlag(flagId: string): Promise<void> {
  if (!(await requireAdmin())) throw new Error("No autorizado");
  const flag = await prisma.featureFlag.findUnique({
    where: { id: flagId },
    select: { enabled: true },
  });
  if (!flag) throw new Error("Flag no encontrado");
  await prisma.featureFlag.update({
    where: { id: flagId },
    data: { enabled: !flag.enabled },
  });
  revalidatePath("/admin/feature-flags");
}

export async function updateTherapistSpecialty(formData: FormData): Promise<void> {
  if (!(await requireAdmin())) throw new Error("No autorizado");
  const userId = formData.get("userId") as string;
  const specialty = formData.get("specialty") as "CLINICAL_PSYCHOLOGY" | "SOCIAL_INTEGRATION";
  await prisma.user.update({ where: { id: userId }, data: { specialty } });
  revalidatePath("/admin/terapeutas");
}

export async function createFeatureFlag(
  _prevState: unknown,
  formData: FormData
) {
  if (!(await requireAdmin())) return { error: "No autorizado" };
  const key = formData.get("key") as string;
  const scope = formData.get("scope") as string;
  const userId = (formData.get("userId") as string) || null;

  if (!key || !scope) return { error: "Campos requeridos" };

  try {
    await prisma.featureFlag.create({
      data: {
        key,
        scope: scope as "GLOBAL" | "PER_USER",
        userId: scope === "PER_USER" ? userId : null,
        enabled: false,
      },
    });
  } catch {
    return { error: "Ya existe un flag con esa configuración" };
  }

  revalidatePath("/admin/feature-flags");
  return { success: true };
}
