import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";

export default async function AdminFeedbackPage() {
  const feedbacks = await prisma.feedback.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const t = await getTranslations("admin.feedbackPage");

  // Los adjuntos son blobs privados: se sirven a través del proxy autenticado.
  const proxy = (url: string) =>
    `/api/feedback-attachment?url=${encodeURIComponent(url)}`;

  const typeLabels: Record<string, string> = {
    BUG: t("bug"),
    FEATURE_REQUEST: t("feature"),
    IMPROVEMENT: t("improvement"),
    OTHER: t("other"),
  };

  const priorityLabels: Record<string, { label: string; style: string }> = {
    LOW: { label: t("priorityLow"), style: "bg-warm-100 text-warm-600" },
    MEDIUM: { label: t("priorityMedium"), style: "bg-cream-100 text-cream-700" },
    HIGH: { label: t("priorityHigh"), style: "bg-red-100 text-red-700" },
  };

  const statusLabels: Record<string, { label: string; style: string }> = {
    NEW: { label: t("statusNew"), style: "bg-lilac-100 text-lilac-700" },
    SEEN: { label: t("statusSeen"), style: "bg-warm-100 text-warm-600" },
    IN_PROGRESS: { label: t("statusInProgress"), style: "bg-sage-100 text-sage-700" },
    DONE: { label: t("statusDone"), style: "bg-sage-100 text-sage-700" },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-warm-900">{t("title")}</h1>

      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
          <p className="text-warm-500">{t("noFeedback")}</p>
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
                    <p className="text-xs text-warm-500">{fb.user.name} · {fb.user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-700 font-medium">
                      {typeLabels[fb.type] ?? fb.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priority.style}`}>{priority.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.style}`}>{status.label}</span>
                    <span className="text-xs text-warm-400">
                      {new Date(fb.createdAt).toLocaleDateString("es-AR")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-warm-700">{fb.description}</p>
                {fb.currentBehavior && (
                  <p className="text-xs text-warm-500">
                    <span className="font-medium">{t("currentBehavior")}</span> {fb.currentBehavior}
                  </p>
                )}
                {fb.desiredBehavior && (
                  <p className="text-xs text-warm-500">
                    <span className="font-medium">{t("desiredBehavior")}</span> {fb.desiredBehavior}
                  </p>
                )}
                {fb.attachmentUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {fb.attachmentUrls.map((url, i) => {
                      const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
                      const isImage = ["jpg", "jpeg", "png", "webp"].includes(ext);
                      const src = proxy(url);
                      return isImage ? (
                        <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                          <img src={src} alt={`Adjunto ${i + 1}`} className="h-16 w-16 object-cover rounded-lg border border-warm-200 hover:opacity-80 transition" />
                        </a>
                      ) : (
                        <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-warm-200 bg-warm-50 text-xs text-warm-700 hover:bg-warm-100 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warm-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Ver video →
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
