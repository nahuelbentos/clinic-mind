"use client";

import { useActionState, useState } from "react";
import { createAppointmentAction } from "@/lib/actions/appointments";

export default function NewAppointmentForm({
  patients,
}: {
  patients: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(createAppointmentAction, null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white font-medium py-2.5 px-4 rounded-lg transition text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Nueva cita
      </button>
    );
  }

  return (
    <form
      action={action}
      className="bg-white rounded-2xl border border-warm-200 p-6 space-y-4"
    >
      {state?.error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-sage-50 text-sage-700 px-4 py-3 rounded-lg text-sm">
          Cita creada exitosamente.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-warm-700 mb-1">
            Paciente
          </label>
          <select
            id="patientId"
            name="patientId"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
          >
            <option value="">Seleccionar...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="scheduledAt" className="block text-sm font-medium text-warm-700 mb-1">
            Fecha y hora
          </label>
          <input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition text-sm font-medium disabled:opacity-50"
        >
          {pending ? "Guardando..." : "Crear cita"}
        </button>
      </div>
    </form>
  );
}
