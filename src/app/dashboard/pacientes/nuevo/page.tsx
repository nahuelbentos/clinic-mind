import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NuevoPacienteForm from "./_form";

export default async function NuevoPacientePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { specialty: true },
  });

  return (
    <NuevoPacienteForm specialty={user?.specialty ?? "CLINICAL_PSYCHOLOGY"} />
  );
}
