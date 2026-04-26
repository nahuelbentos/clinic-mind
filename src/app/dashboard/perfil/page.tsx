import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      profession: true,
      licenseNumber: true,
      plan: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-warm-900">Mi perfil</h1>

      <div className="bg-white rounded-2xl border border-warm-200 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-warm-100">
          <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-warm-900 font-semibold">{user.name}</p>
            <p className="text-sm text-warm-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-sage-100 text-sage-700 font-medium">
                Plan {user.plan}
              </span>
              <span className="text-xs text-warm-400">
                Desde {new Date(user.createdAt).toLocaleDateString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        <ProfileForm
          defaultValues={{
            name: user.name,
            profession: user.profession || "",
            licenseNumber: user.licenseNumber || "",
          }}
        />
      </div>
    </div>
  );
}
