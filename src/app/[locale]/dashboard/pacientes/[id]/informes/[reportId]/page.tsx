import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import ReportActions from "./_actions";
import { getTranslations } from "next-intl/server";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string; reportId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { id: patientId, reportId } = await params;
  const db = getDb(session.user.id);
  const t = await getTranslations("reportDetail");
  const tReports = await getTranslations("reports");

  const [report, canDelete] = await Promise.all([
    db.report.findFirst({
      where: {
        id: reportId,
        deletedAt: null,
        patient: { id: patientId, userId: session.user.id },
      },
      include: { patient: { select: { firstName: true, lastName: true } } },
    }),
    isFeatureEnabled("DELETE_REPORTS", session.user.id),
  ]);

  if (!report) notFound();

  const progressScaleLabels: Record<string, { label: string; style: string }> = {
    INITIAL: { label: tReports("progressLabels.INITIAL"), style: "bg-red-100 text-red-700" },
    IN_DEVELOPMENT: { label: tReports("progressLabels.IN_DEVELOPMENT"), style: "bg-cream-100 text-cream-700" },
    ACHIEVED: { label: tReports("progressLabels.ACHIEVED"), style: "bg-sage-100 text-sage-700" },
  };

  const ps = progressScaleLabels[report.progressScale];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/pacientes/${patientId}`} className="p-2 hover:bg-warm-100 rounded-lg transition">
          <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-warm-900">{t("title")}</h1>
          <p className="text-sm text-warm-500">{report.patient.firstName} {report.patient.lastName}</p>
        </div>
        <ReportActions reportId={report.id} canDelete={canDelete} />
      </div>

      <div className="bg-white rounded-2xl border border-warm-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-warm-500">{t("period")}</p>
            <p className="text-sm font-medium text-warm-900 mt-0.5">
              {new Date(report.periodStart).toLocaleDateString("es-AR")} →{" "}
              {new Date(report.periodEnd).toLocaleDateString("es-AR")}
            </p>
          </div>
          <div>
            <p className="text-xs text-warm-500">{t("area")}</p>
            <p className="text-sm font-medium text-warm-900 mt-0.5">
              {tReports(`areaLabels.${report.area}` as Parameters<typeof tReports>[0]) ?? report.area}
            </p>
          </div>
          <div>
            <p className="text-xs text-warm-500">{t("progressScale")}</p>
            <span className={`inline-block mt-0.5 text-xs px-2.5 py-1 rounded-full font-medium ${ps.style}`}>
              {ps.label}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 print:space-y-6">
        <ReportSection title={t("observations")} content={report.observations} />
        <ReportSection title={t("recommendations")} content={report.recommendations} />
        <ReportSection title={t("nextObjectives")} content={report.nextObjectives} />
      </div>

      <p className="text-xs text-warm-400 text-right">
        {t("generatedOn", { date: new Date(report.createdAt).toLocaleDateString("es-AR") })}
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
