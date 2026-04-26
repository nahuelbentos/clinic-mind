import { prisma } from "@/lib/prisma";

const typeLabels: Record<string, string> = {
  BUG: "Bug",
  FEATURE_REQUEST: "Feature",
  IMPROVEMENT: "Mejora",
  OTHER: "Otro",
};

const priorityLabels: Record<string, { label: string; style: string }> = {
  LOW: { label: "Baja", style: "bg-warm-100 text-warm-600" },
  MEDIUM: { label: "Media", style: "bg-cream-100 text-cream-700" },
  HIGH: { label: "Alta", style: "bg-red-100 text-red-700" },
};

const statusLabels: Record<string, { label: string; style: string }> = {
  NEW: { label: "Nuevo", style: "bg-lilac-100 text-lilac-700" },
  SEEN: { label: "Visto", style: "bg-warm-100 text-warm-600" },
  IN_PROGRESS: { label: "En progreso", style: "bg-sage-100 text-sage-700" },
  DONE: { label: "Listo", style: "bg-sage-100 text-sage-700" },
};

export default async function AdminFeedbackPage() {
  const feedbacks = await prisma.feedback.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-warm-900">Feedback</h1>

      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
          <p className="text-warm-500">No hay feedback todavía.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => {
            const priority = priorityLabels[fb.priority];
            const status = statusLabels[fb.status];
            return (
              <div key={fb.id} className="bg-white rounded-2xl border border-warm-200 p-5 space-y-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-warm-900">{fb.title}</p>
                    <p className="text-xs text-warm-500">
                      {fb.user.name} · {fb.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-700 font-medium">
                      {typeLabels[fb.type] ?? fb.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.style}`}>
                      {priority.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.style}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-warm-400">
                      {new Date(fb.createdAt).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-warm-700">{fb.description}</p>
                {fb.currentBehavior && (
                  <p className="text-xs text-warm-500">
                    <span className="font-medium">Comportamiento actual:</span> {fb.currentBehavior}
                  </p>
                )}
                {fb.desiredBehavior && (
                  <p className="text-xs text-warm-500">
                    <span className="font-medium">Comportamiento deseado:</span> {fb.desiredBehavior}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
