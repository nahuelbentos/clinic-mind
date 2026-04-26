"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations";
import { redirect } from "next/navigation";

export async function registerAction(_prevState: unknown, formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    profession: formData.get("profession") as string,
    licenseNumber: formData.get("licenseNumber") as string,
  };

  const result = registerSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({
    where: { email: result.data.email },
  });
  if (existing) {
    return { error: "Ya existe una cuenta con ese email" };
  }

  const hashedPassword = await hash(result.data.password, 12);

  await prisma.user.create({
    data: {
      name: result.data.name,
      email: result.data.email,
      password: hashedPassword,
      profession: result.data.profession || null,
      licenseNumber: result.data.licenseNumber || null,
    },
  });

  await signIn("credentials", {
    email: result.data.email,
    password: result.data.password,
    redirect: false,
  });

  redirect("/dashboard");
}

export async function loginAction(_prevState: unknown, formData: FormData) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });
  } catch {
    return { error: "Credenciales inválidas" };
  }

  redirect("/dashboard");
}
