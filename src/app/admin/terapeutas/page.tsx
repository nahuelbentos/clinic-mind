import { prisma } from "@/lib/prisma";
import { toggleUserActive, updateUserPlanAction } from "@/lib/actions/admin";

export default async function TerapeutasPage() {
  const therapists = await prisma.user.findMany({
    where: { role: "THERAPIST" },
    include: {
      patients: {
        where: { deletedAt: null },
        select: {
          _count: { select: { sessions: { where: { deletedAt: null } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-warm-900">Terapeutas</h1>

      <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-warm-50 border-b border-warm-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Email</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Plan</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Activo</th>
              <th className="text-right px-4 py-3 font-medium text-warm-700">Pacientes</th>
              <th className="text-right px-4 py-3 font-medium text-warm-700">Sesiones</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-100">
            {therapists.map((t) => {
              const sessionCount = t.patients.reduce(
                (acc, p) => acc + p._count.sessions,
                0
              );
              const boundToggle = toggleUserActive.bind(null, t.id);
              return (
                <tr key={t.id} className="hover:bg-warm-50 transition">
                  <td className="px-4 py-3 font-medium text-warm-900">{t.name}</td>
                  <td className="px-4 py-3 text-warm-600">{t.email}</td>
                  <td className="px-4 py-3">
                    <form action={updateUserPlanAction} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={t.id} />
                      <select
                        name="plan"
                        defaultValue={t.plan}
                        className="px-2 py-1 rounded-lg border border-warm-300 text-xs focus:ring-2 focus:ring-sage-500 outline-none"
                      >
                        <option value="FREE">Free</option>
                        <option value="PRO">Pro</option>
                      </select>
                      <button
                        type="submit"
                        className="text-xs px-2 py-1 bg-sage-100 text-sage-700 rounded hover:bg-sage-200 transition"
                      >
                        Guardar
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        t.isActive
                          ? "bg-sage-100 text-sage-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.isActive ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-warm-700">
                    {t.patients.length}
                  </td>
                  <td className="px-4 py-3 text-right text-warm-700">
                    {sessionCount}
                  </td>
                  <td className="px-4 py-3">
                    <form action={boundToggle}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition"
                      >
                        {t.isActive ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {therapists.length === 0 && (
          <p className="text-center text-warm-500 py-12">No hay terapeutas registrados.</p>
        )}
      </div>
    </div>
  );
}
