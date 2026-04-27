import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { Link } from "@/i18n/navigation";
import DeletePatientButton from "@/components/dashboard/DeletePatientButton";
import { getTranslations } from "next-intl/server";

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const params = await searchParams;
  const query = params.q || "";
  const statusFilter = params.status || "";

  const db = getDb(session.user.id);
  const t = await getTranslations("patients");

  const [patients, user, canDeletePatients] = await Promise.all([
    db.patient.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
        ...(statusFilter && { status: statusFilter as "ACTIVE" | "PAUSED" | "DISCHARGED" }),
        ...(query && {
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        sessions: { where: { deletedAt: null }, orderBy: { date: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.user.findUnique({ where: { id: session.user.id }, select: { plan: true } }),
    isFeatureEnabled("DELETE_PATIENTS", session.user.id),
  ]);

  const limit = PLAN_LIMITS[user?.plan ?? "FREE"]?.maxPatients ?? 5;
  const atLimit = user?.plan === "FREE" && patients.length >= limit;

  const statusLabels: Record<string, { label: string; style: string }> = {
    ACTIVE: { label: t("statusActive"), style: "bg-sage-100 text-sage-700" },
    PAUSED: { label: t("statusPaused"), style: "bg-cream-100 text-cream-700" },
    DISCHARGED: { label: t("statusDischarged"), style: "bg-warm-100 text-warm-600" },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-warm-900">{t("title")}</h1>
        <Link
          href="/dashboard/pacientes/nuevo"
          className="inline-flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white font-medium py-2.5 px-4 rounded-lg transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {t("new")}
        </Link>
      </div>

      {atLimit && (
        <div className="bg-cream-50 border border-cream-300 text-cream-800 px-4 py-3 rounded-lg text-sm">
          {t("limitReached")}
        </div>
      )}

      <form className="flex flex-col sm:flex-row gap-3">
        <input
          name="q"
          type="text"
          defaultValue={query}
          placeholder={t("searchPlaceholder")}
          className="flex-1 px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
        />
        <select
          name="status"
          defaultValue={statusFilter}
          className="px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
        >
          <option value="">{t("allStatuses")}</option>
          <option value="ACTIVE">{t("active")}</option>
          <option value="PAUSED">{t("paused")}</option>
          <option value="DISCHARGED">{t("discharged")}</option>
        </select>
        <button
          type="submit"
          className="bg-warm-100 hover:bg-warm-200 text-warm-700 font-medium py-2.5 px-4 rounded-lg transition text-sm"
        >
          {t("filter")}
        </button>
      </form>

      {patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
          <p className="text-warm-500">{t("noPatients")}</p>
          <Link
            href="/dashboard/pacientes/nuevo"
            className="text-sage-600 hover:text-sage-700 text-sm font-medium mt-2 inline-block"
          >
            {t("addFirst")}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-warm-200 divide-y divide-warm-100">
          {patients.map((patient) => {
            const lastSession = patient.sessions[0];
            const statusInfo = statusLabels[patient.status];
            return (
              <div key={patient.id} className="flex items-center gap-4 p-4 hover:bg-warm-50 transition">
                <Link
                  href={`/dashboard/pacientes/${patient.id}`}
                  className="flex-1 flex items-center gap-4 min-w-0"
                >
                  <div className="w-11 h-11 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center text-sm font-semibold shrink-0">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warm-900">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-xs text-warm-500">
                      {lastSession
                        ? t("lastSession", { date: new Date(lastSession.date).toLocaleDateString("es-AR") })
                        : t("noSessionsYet")}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusInfo.style}`}>
                    {statusInfo.label}
                  </span>
                </Link>
                {canDeletePatients && <DeletePatientButton patientId={patient.id} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
