"use client";

import { useActionState, useState } from "react";
import { useParams } from "next/navigation";
import { createSessionAction } from "@/lib/actions/sessions";
import Link from "next/link";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-warm-50 rounded-lg border border-warm-300 animate-pulse" />
  ),
});

export default function NuevaSesionPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [notes, setNotes] = useState("");
  const [meetLink, setMeetLink] = useState("");

  const boundAction = createSessionAction.bind(null, patientId);
  const [state, action, pending] = useActionState(boundAction, null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/pacientes/${patientId}`}
          className="p-2 hover:bg-warm-100 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">Nueva sesión</h1>
      </div>

      <form action={action} className="space-y-6">
        {state?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <input type="hidden" name="notes" value={notes} />

        <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">Detalles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-warm-700 mb-1">
                Fecha *
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              />
            </div>
            <div>
              <label htmlFor="sessionNumber" className="block text-sm font-medium text-warm-700 mb-1">
                N.o de sesión *
              </label>
              <input
                id="sessionNumber"
                name="sessionNumber"
                type="number"
                min={1}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-warm-700 mb-1">
                Duración (min)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                defaultValue={50}
                min={1}
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-warm-700 mb-1">
                Estado
              </label>
              <select
                id="status"
                name="status"
                defaultValue="COMPLETED"
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              >
                <option value="COMPLETED">Completada</option>
                <option value="SCHEDULED">Programada</option>
                <option value="CANCELLED">Cancelada</option>
                <option value="NO_SHOW">Ausente</option>
              </select>
            </div>
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-warm-700 mb-1">
                Estado de pago
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                defaultValue="PENDING"
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              >
                <option value="PENDING">Pendiente</option>
                <option value="PAID">Pagado</option>
                <option value="EXEMPT">Exento</option>
              </select>
            </div>
            <div>
              <label htmlFor="paymentAmount" className="block text-sm font-medium text-warm-700 mb-1">
                Monto ($)
              </label>
              <input
                id="paymentAmount"
                name="paymentAmount"
                type="number"
                step="0.01"
                min={0}
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">Reunión online</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="meetLink" className="block text-sm font-medium text-warm-700 mb-1">
                Link de reunión
              </label>
              <input
                id="meetLink"
                name="meetLink"
                type="url"
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              />
            </div>
            <div>
              <label htmlFor="meetProvider" className="block text-sm font-medium text-warm-700 mb-1">
                Plataforma
              </label>
              <select
                id="meetProvider"
                name="meetProvider"
                disabled={!meetLink}
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm disabled:opacity-50 disabled:bg-warm-50"
              >
                <option value="">Seleccionar...</option>
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="ZOOM">Zoom</option>
                <option value="TEAMS">Teams</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-warm-900">Notas de sesión</h2>
          <div data-color-mode="light">
            <MDEditor
              value={notes}
              onChange={(val) => setNotes(val || "")}
              height={300}
              preview="edit"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-warm-200 p-6">
          <label htmlFor="nextSessionGoal" className="block text-sm font-medium text-warm-700 mb-1">
            Objetivo para la próxima sesión
          </label>
          <textarea
            id="nextSessionGoal"
            name="nextSessionGoal"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href={`/dashboard/pacientes/${patientId}`}
            className="px-6 py-2.5 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition text-sm font-medium"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-2.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition text-sm font-medium disabled:opacity-50"
          >
            {pending ? "Guardando..." : "Guardar sesión"}
          </button>
        </div>
      </form>
    </div>
  );
}
