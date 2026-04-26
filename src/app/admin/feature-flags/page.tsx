import { prisma } from "@/lib/prisma";
import { toggleFeatureFlag } from "@/lib/actions/admin";
import CreateFlagForm from "@/components/admin/CreateFlagForm";

export default async function FeatureFlagsPage() {
  const [flags, therapists] = await Promise.all([
    prisma.featureFlag.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "THERAPIST" },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-warm-900">Feature Flags</h1>

      {/* Flags table */}
      <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-warm-50 border-b border-warm-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Key</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Scope</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Usuario</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Habilitado</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-100">
            {flags.map((flag) => {
              const boundToggle = toggleFeatureFlag.bind(null, flag.id);
              return (
                <tr key={flag.id} className="hover:bg-warm-50 transition">
                  <td className="px-4 py-3 font-mono text-xs text-warm-900">{flag.key}</td>
                  <td className="px-4 py-3 text-warm-600">{flag.scope}</td>
                  <td className="px-4 py-3 text-warm-600">
                    {flag.user ? `${flag.user.name} (${flag.user.email})` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        flag.enabled
                          ? "bg-sage-100 text-sage-700"
                          : "bg-warm-100 text-warm-600"
                      }`}
                    >
                      {flag.enabled ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={boundToggle}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition"
                      >
                        {flag.enabled ? "Deshabilitar" : "Habilitar"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {flags.length === 0 && (
          <p className="text-center text-warm-500 py-12">No hay flags creados.</p>
        )}
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-warm-900">Nuevo flag</h2>
        <CreateFlagForm therapists={therapists} />
      </div>
    </div>
  );
}
