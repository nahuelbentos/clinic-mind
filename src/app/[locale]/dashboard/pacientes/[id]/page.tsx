import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import PatientTabs from "@/components/dashboard/PatientTabs";
import StatusChanger from "@/components/dashboard/StatusChanger";
import { getTranslations } from "next-intl/server";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { id } = await params;
  const db = getDb(session.user.id);
  const t = await getTranslations("patientDetail");

  const [patient, user, canDeleteSessions, canDeleteGoals, canDeleteReports] = await Promise.all([
    db.patient.findFirst({
      where: { id, userId: session.user.id },
      include: {
        clinicalProfile: true,
        sessions: { where: { deletedAt: null }, orderBy: { date: "desc" } },
        appointments: { orderBy: { scheduledAt: "desc" } },
        goals: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
        reports: { where: { deletedAt: null }, orderBy: { periodEnd: "desc" } },
      },
    }),
    db.user.findUnique({ where: { id: session.user.id }, select: { specialty: true } }),
    isFeatureEnabled("DELETE_SESSIONS", session.user.id),
    isFeatureEnabled("DELETE_GOALS", session.user.id),
    isFeatureEnabled("DELETE_REPORTS", session.user.id),
  ]);

  if (!patient) notFound();

  const specialty = user?.specialty ?? "CLINICAL_PSYCHOLOGY";
  const isSocialIntegration = specialty === "SOCIAL_INTEGRATION";

  const statusLabels: Record<string, { label: string; style: string }> = {
    ACTIVE: { label: t("statusActive"), style: "bg-sage-100 text-sage-700" },
    PAUSED: { label: t("statusPaused"), style: "bg-cream-100 text-cream-700" },
    DISCHARGED: { label: t("statusDischarged"), style: "bg-warm-100 text-warm-600" },
  };
  const statusInfo = statusLabels[patient.status];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <Link href="/dashboard/pacientes" className="p-2 hover:bg-warm-100 rounded-lg transition mt-1">
          <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-warm-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo.style}`}>
              {statusInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-warm-500">
            {patient.email && <span>{patient.email}</span>}
            {patient.phone && <span>{patient.phone}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <StatusChanger patientId={patient.id} currentStatus={patient.status} />
          {isSocialIntegration && (
            <>
              <Link href={`/dashboard/pacientes/${patient.id}/objetivos/nuevo`} className="bg-lilac-600 hover:bg-lilac-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm">
                {t("newGoal")}
              </Link>
              <Link href={`/dashboard/pacientes/${patient.id}/informes/nuevo`} className="bg-lilac-600 hover:bg-lilac-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm">
                {t("newReport")}
              </Link>
            </>
          )}
          <Link href={`/dashboard/pacientes/${patient.id}/sesiones/nueva`} className="bg-sage-600 hover:bg-sage-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm">
            {t("newSession")}
          </Link>
        </div>
      </div>

      <PatientTabs
        patient={patient}
        specialty={specialty}
        canDeleteSessions={canDeleteSessions}
        canDeleteGoals={canDeleteGoals}
        canDeleteReports={canDeleteReports}
      />
    </div>
  );
}
