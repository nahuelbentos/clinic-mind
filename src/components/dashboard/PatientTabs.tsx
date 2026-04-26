"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MDPreview = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown), {
  ssr: false,
  loading: () => <p className="text-warm-400 text-sm">Cargando...</p>,
});

interface PatientProps {
  patient: {
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
    }[];
    appointments: {
      id: string;
      scheduledAt: Date;
      status: string;
    }[];
  };
}

const tabs = ["Info", "Sesiones", "Citas"];

export default function PatientTabs({ patient }: PatientProps) {
  const [active, setActive] = useState("Info");

  return (
    <div>
      <div className="flex gap-1 border-b border-warm-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              active === tab
                ? "border-sage-600 text-sage-700"
                : "border-transparent text-warm-500 hover:text-warm-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Info" && <InfoTab patient={patient} />}
      {active === "Sesiones" && <SessionsTab sessions={patient.sessions} />}
      {active === "Citas" && <AppointmentsTab appointments={patient.appointments} />}
    </div>
  );
}

function InfoTab({ patient }: PatientProps) {
  const cp = patient.clinicalProfile;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-4">
        <h3 className="font-semibold text-warm-900">Datos personales</h3>
        <InfoRow label="Fecha de inicio" value={new Date(patient.startDate).toLocaleDateString("es-AR")} />
        <InfoRow label="Fecha de nacimiento" value={patient.birthDate ? new Date(patient.birthDate).toLocaleDateString("es-AR") : "—"} />
        <InfoRow label="Género" value={patient.gender || "—"} />
        <InfoRow label="Derivado por" value={patient.referredBy || "—"} />
        <InfoRow label="Contacto de emergencia" value={patient.emergencyContact || "—"} />
      </div>

      <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-4">
        <h3 className="font-semibold text-warm-900">Perfil clínico</h3>
        <InfoRow label="Motivo de consulta" value={cp?.consultationReason || "—"} />
        <InfoRow label="Antecedentes" value={cp?.background || "—"} />
        <InfoRow label="Medicación actual" value={cp?.currentMedication || "—"} />
        <InfoRow label="Terapia previa" value={cp?.previousTherapy || "—"} />
        <InfoRow label="Valores ACT" value={cp?.actValues || "—"} />
      </div>
    </div>
  );
}

function SessionsTab({ sessions }: { sessions: PatientProps["patient"]["sessions"] }) {
  const statusLabels: Record<string, { label: string; style: string }> = {
    COMPLETED: { label: "Completada", style: "bg-sage-100 text-sage-700" },
    SCHEDULED: { label: "Programada", style: "bg-lilac-100 text-lilac-700" },
    CANCELLED: { label: "Cancelada", style: "bg-red-100 text-red-700" },
    NO_SHOW: { label: "Ausente", style: "bg-cream-100 text-cream-700" },
  };
  const paymentLabels: Record<string, string> = {
    PAID: "Pagado",
    PENDING: "Pendiente",
    EXEMPT: "Exento",
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
        <p className="text-warm-500">Aún no hay sesiones registradas.</p>
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
                <span className="text-sm font-semibold text-warm-900">
                  Sesión #{s.sessionNumber}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${si.style}`}>
                  {si.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-warm-500">
                <span>{new Date(s.date).toLocaleDateString("es-AR")}</span>
                <span>{s.duration} min</span>
                <span>
                  {paymentLabels[s.paymentStatus]}
                  {s.paymentAmount ? ` ($${s.paymentAmount})` : ""}
                </span>
              </div>
            </div>
            {s.notes && (
              <div className="mt-3 prose prose-sm max-w-none" data-color-mode="light">
                <MDPreview source={s.notes} />
              </div>
            )}
            {s.nextSessionGoal && (
              <div className="mt-3 p-3 bg-sage-50 rounded-lg">
                <p className="text-xs font-medium text-sage-700 mb-1">
                  Objetivo próxima sesión
                </p>
                <p className="text-sm text-sage-900">{s.nextSessionGoal}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AppointmentsTab({
  appointments,
}: {
  appointments: PatientProps["patient"]["appointments"];
}) {
  const statusLabels: Record<string, { label: string; style: string }> = {
    CONFIRMED: { label: "Confirmada", style: "bg-sage-100 text-sage-700" },
    PENDING: { label: "Pendiente", style: "bg-cream-100 text-cream-700" },
    CANCELLED: { label: "Cancelada", style: "bg-red-100 text-red-700" },
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
        <p className="text-warm-500">No hay citas registradas.</p>
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
                {new Date(a.scheduledAt).toLocaleDateString("es-AR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-warm-500">
                {new Date(a.scheduledAt).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${si.style}`}>
              {si.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-warm-500">{label}</p>
      <p className="text-sm text-warm-900 mt-0.5">{value}</p>
    </div>
  );
}
