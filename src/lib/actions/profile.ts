"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const raw = {
    name: formData.get("name") as string,
    profession: formData.get("profession") as string,
    licenseNumber: formData.get("licenseNumber") as string,
  };

  const result = profileSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: result.data.name,
      profession: result.data.profession || null,
      licenseNumber: result.data.licenseNumber || null,
    },
  });

  revalidatePath("/dashboard/perfil");
  return { success: true };
}

export async function updateLocaleAction(locale: "es" | "en") {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { locale },
  });

  redirect(`/${locale}/dashboard/perfil`);
}
