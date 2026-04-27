"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/navigation";
import { deleteSession } from "@/lib/actions/sessions";
import { updateGoalStatusAction, deleteGoalAction } from "@/lib/actions/goals";
import { deleteReportAction } from "@/lib/actions/reports";
import { useTranslations } from "next-intl";

const MDPreview = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown), {
  ssr: false,
  loading: () => <p className="text-warm-400 text-sm">...</p>,
});

interface Goal {
  id: string;
  description: string;
  area: string;
  status: string;
  targetDate: Date | null;
  notes: string | null;
}

interface Report {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  area: string;
  progressScale: string;
  observations: string;
}

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
  gender: string | null;
  referredBy: string | null;
  emergencyContact: string | null;
  startDate: Date;
  clinicalProfile: {
    consultationReason: string | null;
    background: string | null;
    currentMedication: string | null;
    previousTherapy: string | null;
    actValues: string | null;
    disabilityType: string | null;
    autonomyLevel: string | null;
    integrationContext: string | null;
  } | null;
  sessions: {
    id: string;
    date: Date;
    sessionNumber: number;
    status: string;
    notes: string | null;
    nextSessionGoal: string | null;
    paymentStatus: string;
    paymentAmount: number | null;
    duration: number;
    meetLink: string | null;
    meetProvider: string | null;
  }[];
  appointments: {
    id: string;
    scheduledAt: Date;
    status: string;
  }[];
  goals: Goal[];
  reports: Report[];
}

interface PatientTabsProps {
  patient: PatientData;
  specialty: string;
  canDeleteSessions: boolean;
  canDeleteGoals: boolean;
  canDeleteReports: boolean;
}

export default function PatientTabs({
  patient,
  specialty,
  canDeleteSessions,
  canDeleteGoals,
  canDeleteReports,
}: PatientTabsProps) {
  const tPD = useTranslations("patientDetail");
  const isSocialIntegration = specialty === "SOCIAL_INTEGRATION";

  const tabKeys = [
    { key: "Info", label: tPD("tabInfo") },
    { key: "Sesiones", label: tPD("tabSessions") },
    { key: "Citas", label: tPD("tabAppointments") },
    ...(isSocialIntegration
      ? [
          { key: "Objetivos", label: tPD("tabGoals") },
          { key: "Informes", label: tPD("tabReports") },
        ]
      : []),
  ];

  const [active, setActive] = useState("Info");

  return (
    <div>
      <div className="flex gap-1 border-b border-warm-200 mb-6 overflow-x-auto">
        {tabKeys.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              active === tab.key
                ? "border-sage-600 text-sage-700"
                : "border-transparent text-warm-500 hover:text-warm-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "Info" && <InfoTab patient={patient} isSocialIntegration={isSocialIntegration} />}
      {active === "Sesiones" && <SessionsTab sessions={patient.sessions} canDeleteSessions={canDeleteSessions} />}
      {active === "Citas" && <AppointmentsTab appointments={patient.appointments} />}
      {active === "Objetivos" && isSocialIntegration && <GoalsTab goals={patient.goals} patientId={patient.id} canDeleteGoals={canDeleteGoals} />}
      {active === "Informes" && isSocialIntegration && <ReportsTab reports={patient.reports} patientId={patient.id} canDeleteReports={canDeleteReports} />}
    </div>
  );
}

// ─── Info Tab ─────────────────────────────────────────────────────────────────

function InfoTab({ patient, isSocialIntegration }: { patient: PatientData; isSocialIntegration: boolean }) {
  const t = useTranslations("patientDetail");
  const cp = patient.clinicalProfile;

  const disabilityLabels: Record<string, string> = {
    MOTOR: t("disabilityMotor"),
    COGNITIVE: t("disabilityCognitive"),
    SENSORY: t("disabilitySensory"),
    MULTIPLE: t("disabilityMultiple"),
    OTHER: t("disabilityOther"),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-4">
        <h3 className="font-semibold text-warm-900">{t("personalData")}</h3>
        <InfoRow label={t("startDate")} value={new Date(patient.startDate).toLocaleDateString("es-AR")} />
        <InfoRow label={t("birthDate")} value={patient.birthDate ? new Date(patient.birthDate).toLocaleDateString("es-AR") : "—"} />
        <InfoRow label={t("gender")} value={patient.gender || "—"} />
        <InfoRow label={t("referredBy")} value={patient.referredBy || "—"} />
        <InfoRow label={t("emergencyContact")} value={patient.emergencyContact || "—"} />
      </div>

      <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-4">
        <h3 className="font-semibold text-warm-900">{t("clinicalProfile")}</h3>
        <InfoRow label={t("consultationReason")} value={cp?.consultationReason || "—"} />
        <InfoRow label={t("background")} value={cp?.background || "—"} />
        <InfoRow label={t("currentMedication")} value={cp?.currentMedication || "—"} />
        <InfoRow label={t("previousTherapy")} value={cp?.previousTherapy || "—"} />
        {!isSocialIntegration && <InfoRow label={t("actValues")} value={cp?.actValues || "—"} />}
      </div>

      {isSocialIntegration && (
        <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-4 lg:col-span-2">
          <h3 className="font-semibold text-warm-900">{t("socialIntegrationSection")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoRow label={t("disabilityType")} value={cp?.disabilityType ? (disabilityLabels[cp.disabilityType] ?? cp.disabilityType) : "—"} />
            <InfoRow label={t("autonomyLevel")} value={cp?.autonomyLevel || "—"} />
            <InfoRow label={t("integrationContext")} value={cp?.integrationContext || "—"} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sessions Tab ─────────────────────────────────────────────────────────────

function SessionsTab({ sessions, canDeleteSessions }: { sessions: PatientData["sessions"]; canDeleteSessions: boolean }) {
  const t = useTranslations("sessions");

  const statusLabels: Record<string, { label: string; style: string }> = {
    COMPLETED: { label: t("completed"), style: "bg-sage-100 text-sage-700" },
    SCHEDULED: { label: t("scheduled"), style: "bg-lilac-100 text-lilac-700" },
    CANCELLED: { label: t("cancelled"), style: "bg-red-100 text-red-700" },
    NO_SHOW: { label: t("noShow"), style: "bg-cream-100 text-cream-700" },
  };
  const paymentLabels: Record<string, string> = {
    PAID: t("paid"),
    PENDING: t("pending"),
    EXEMPT: t("exempt"),
  };
  const providerLabels: Record<string, string> = {
    GOOGLE_MEET: "Google Meet",
    ZOOM: "Zoom",
    TEAMS: "Teams",
    OTHER: "Otro",
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
        <p className="text-warm-500">{t("noSessions")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((s) => {
        const si = statusLabels[s.status];
        return (
          <div key={s.id} className="bg-white rounded-2xl border border-warm-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-warm-900">{t("session")} #{s.sessionNumber}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${si.style}`}>{si.label}</span>
                {s.meetLink && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-lilac-100 text-lilac-700">
                    {s.meetProvider ? providerLabels[s.meetProvider] ?? s.meetProvider : t("online")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-warm-500">
                <span>{new Date(s.date).toLocaleDateString("es-AR")}</span>
                <span>{s.duration} min</span>
                <span>
                  {paymentLabels[s.paymentStatus]}
                  {s.paymentAmount ? ` ($${s.paymentAmount})` : ""}
                </span>
                {s.meetLink && (
                  <a href={s.meetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sage-600 text-white hover:bg-sage-700 transition font-medium" onClick={(e) => e.stopPropagation()}>
                    {t("join")}
                  </a>
                )}
                {canDeleteSessions && <DeleteSessionButton sessionId={s.id} />}
              </div>
            </div>
            {s.notes && (
              <div className="mt-3 prose prose-sm max-w-none" data-color-mode="light">
                <MDPreview source={s.notes} />
              </div>
            )}
            {s.nextSessionGoal && (
              <div className="mt-3 p-3 bg-sage-50 rounded-lg">
                <p className="text-xs font-medium text-sage-700 mb-1">{t("nextGoal")}</p>
                <p className="text-sm text-sage-900">{s.nextSessionGoal}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Appointments Tab ─────────────────────────────────────────────────────────

function AppointmentsTab({ appointments }: { appointments: PatientData["appointments"] }) {
  const t = useTranslations("appointments");

  const statusLabels: Record<string, { label: string; style: string }> = {
    CONFIRMED: { label: t("statusConfirmed"), style: "bg-sage-100 text-sage-700" },
    PENDING: { label: t("statusPending"), style: "bg-cream-100 text-cream-700" },
    CANCELLED: { label: t("statusCancelled"), style: "bg-red-100 text-red-700" },
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
        <p className="text-warm-500">{t("noAppointments")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-warm-200 divide-y divide-warm-100">
      {appointments.map((a) => {
        const si = statusLabels[a.status];
        return (
          <div key={a.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-warm-900">
                {new Date(a.scheduledAt).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="text-xs text-warm-500">
                {new Date(a.scheduledAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${si.style}`}>{si.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Goals Tab ────────────────────────────────────────────────────────────────

const statusOrder = ["IN_PROGRESS", "PENDING", "ACHIEVED"];

function GoalsTab({ goals, patientId, canDeleteGoals }: { goals: Goal[]; patientId: string; canDeleteGoals: boolean }) {
  const t = useTranslations("goals");

  const goalAreaLabels: Record<string, string> = {
    SOCIAL: t("areaLabels.SOCIAL"),
    LABOR: t("areaLabels.LABOR"),
    EDUCATIONAL: t("areaLabels.EDUCATIONAL"),
    FAMILY: t("areaLabels.FAMILY"),
  };

  const goalStatusLabels: Record<string, { label: string; style: string }> = {
    PENDING: { label: t("statusLabels.PENDING"), style: "bg-cream-100 text-cream-700" },
    IN_PROGRESS: { label: t("statusLabels.IN_PROGRESS"), style: "bg-lilac-100 text-lilac-700" },
    ACHIEVED: { label: t("statusLabels.ACHIEVED"), style: "bg-sage-100 text-sage-700" },
  };

  const sorted = [...goals].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
        <p className="text-warm-500">{t("noGoals")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((g) => {
        const si = goalStatusLabels[g.status];
        return (
          <div key={g.id} className="bg-white rounded-2xl border border-warm-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-warm-900">{g.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-600 font-medium">
                    {goalAreaLabels[g.area] ?? g.area}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${si.style}`}>{si.label}</span>
                  {g.targetDate && (
                    <span className="text-xs text-warm-400">
                      {t("estimated", { date: new Date(g.targetDate).toLocaleDateString("es-AR") })}
                    </span>
                  )}
                </div>
                {g.notes && <p className="text-xs text-warm-500 mt-1">{g.notes}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <GoalStatusChanger goalId={g.id} currentStatus={g.status} />
                {canDeleteGoals && <DeleteGoalButton goalId={g.id} />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GoalStatusChanger({ goalId, currentStatus }: { goalId: string; currentStatus: string }) {
  const t = useTranslations("goals");

  const nextStatusMap: Record<string, { value: string; label: string }[]> = {
    PENDING: [
      { value: "IN_PROGRESS", label: t("start") },
      { value: "ACHIEVED", label: t("achieved") },
    ],
    IN_PROGRESS: [
      { value: "ACHIEVED", label: t("achieved") },
      { value: "PENDING", label: t("pause") },
    ],
    ACHIEVED: [
      { value: "IN_PROGRESS", label: t("reactivate") },
    ],
  };

  const options = nextStatusMap[currentStatus] ?? [];

  async function handleChange(status: string) {
    await updateGoalStatusAction(goalId, status as "PENDING" | "IN_PROGRESS" | "ACHIEVED");
  }

  return (
    <div className="flex gap-1">
      {options.map((o) => (
        <button key={o.value} onClick={() => handleChange(o.value)} className="text-xs px-2.5 py-1 rounded-lg border border-warm-300 text-warm-600 hover:bg-warm-100 transition">
          {o.label}
        </button>
      ))}
    </div>
  );
}

function DeleteGoalButton({ goalId }: { goalId: string }) {
  const t = useTranslations("goals");
  async function handleDelete() {
    if (!confirm(t("deleteConfirm"))) return;
    const result = await deleteGoalAction(goalId);
    if (result?.error) alert(result.error);
  }
  return (
    <button onClick={handleDelete} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition">
      {t("delete")}
    </button>
  );
}

// ─── Reports Tab ──────────────────────────────────────────────────────────────

function ReportsTab({ reports, patientId, canDeleteReports }: { reports: Report[]; patientId: string; canDeleteReports: boolean }) {
  const t = useTranslations("reports");

  const reportAreaLabels: Record<string, string> = {
    SOCIAL_INTEGRATION: t("areaLabels.SOCIAL_INTEGRATION"),
    LABOR_INTEGRATION: t("areaLabels.LABOR_INTEGRATION"),
    EDUCATIONAL_INTEGRATION: t("areaLabels.EDUCATIONAL_INTEGRATION"),
    FAMILY_INTEGRATION: t("areaLabels.FAMILY_INTEGRATION"),
    AUTONOMY: t("areaLabels.AUTONOMY"),
  };

  const progressScaleLabels: Record<string, { label: string; style: string }> = {
    INITIAL: { label: t("progressLabels.INITIAL"), style: "bg-red-100 text-red-700" },
    IN_DEVELOPMENT: { label: t("progressLabels.IN_DEVELOPMENT"), style: "bg-cream-100 text-cream-700" },
    ACHIEVED: { label: t("progressLabels.ACHIEVED"), style: "bg-sage-100 text-sage-700" },
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
        <p className="text-warm-500">{t("noReports")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => {
        const ps = progressScaleLabels[r.progressScale];
        return (
          <Link key={r.id} href={`/dashboard/pacientes/${patientId}/informes/${r.id}`} className="block bg-white rounded-2xl border border-warm-200 p-5 hover:border-sage-300 transition">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-warm-900">
                  {new Date(r.periodStart).toLocaleDateString("es-AR")} → {new Date(r.periodEnd).toLocaleDateString("es-AR")}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-600 font-medium">
                    {reportAreaLabels[r.area] ?? r.area}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ps.style}`}>{ps.label}</span>
                </div>
                <p className="text-xs text-warm-500 line-clamp-2">
                  {r.observations.slice(0, 100)}{r.observations.length > 100 ? "..." : ""}
                </p>
              </div>
              <svg className="w-4 h-4 text-warm-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-warm-500">{label}</p>
      <p className="text-sm text-warm-900 mt-0.5">{value}</p>
    </div>
  );
}

function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const t = useTranslations("sessions");
  async function handleDelete() {
    if (!confirm(t("deleteConfirm"))) return;
    const result = await deleteSession(sessionId);
    if (result?.error) alert(result.error);
  }
  return (
    <button onClick={handleDelete} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition">
      {t("delete")}
    </button>
  );
}
