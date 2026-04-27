import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReportActions from "./_actions";

const reportAreaLabels: Record<string, string> = {
  SOCIAL_INTEGRATION: "Integración social",
  LABOR_INTEGRATION: "Integración laboral",
  EDUCATIONAL_INTEGRATION: "Integración educativa",
  FAMILY_INTEGRATION: "Integración familiar",
  AUTONOMY: "Autonomía",
};

const progressScaleLabels: Record<string, { label: string; style: string }> = {
  INITIAL: { label: "Inicial", style: "bg-red-100 text-red-700" },
  IN_DEVELOPMENT: { label: "En desarrollo", style: "bg-cream-100 text-cream-700" },
  ACHIEVED: { label: "Alcanzado", style: "bg-sage-100 text-sage-700" },
};

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { id: patientId, reportId } = await params;
  const db = getDb(session.user.id);

  const [report, canDelete] = await Promise.all([
    db.report.findFirst({
      where: {
        id: reportId,
        deletedAt: null,
        patient: { id: patientId, userId: session.user.id },
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
      },
    }),
    isFeatureEnabled("DELETE_REPORTS", session.user.id),
  ]);

  if (!report) notFound();

  const ps = progressScaleLabels[report.progressScale];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/pacientes/${patientId}`}
          className="p-2 hover:bg-warm-100 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-warm-900">Informe de integración</h1>
          <p className="text-sm text-warm-500">
            {report.patient.firstName} {report.patient.lastName}
          </p>
        </div>
        <ReportActions reportId={report.id} canDelete={canDelete} />
      </div>

      {/* Meta */}
      <div className="bg-white rounded-2xl border border-warm-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-warm-500">Período</p>
            <p className="text-sm font-medium text-warm-900 mt-0.5">
              {new Date(report.periodStart).toLocaleDateString("es-AR")} →{" "}
              {new Date(report.periodEnd).toLocaleDateString("es-AR")}
            </p>
          </div>
          <div>
            <p className="text-xs text-warm-500">Área</p>
            <p className="text-sm font-medium text-warm-900 mt-0.5">
              {reportAreaLabels[report.area] ?? report.area}
            </p>
          </div>
          <div>
            <p className="text-xs text-warm-500">Escala de progreso</p>
            <span className={`inline-block mt-0.5 text-xs px-2.5 py-1 rounded-full font-medium ${ps.style}`}>
              {ps.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 print:space-y-6">
        <ReportSection title="Observaciones" content={report.observations} />
        <ReportSection title="Recomendaciones" content={report.recommendations} />
        <ReportSection title="Próximos objetivos" content={report.nextObjectives} />
      </div>

      <p className="text-xs text-warm-400 text-right">
        Generado el {new Date(report.createdAt).toLocaleDateString("es-AR")}
      </p>
    </div>
  );
}

function ReportSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-white rounded-2xl border border-warm-200 p-6">
      <h2 className="text-sm font-semibold text-warm-700 mb-3">{title}</h2>
      <p className="text-sm text-warm-900 whitespace-pre-wrap">{content}</p>
    </div>
  );
}
