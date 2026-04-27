"use client";

import { useActionState } from "react";
import { createReportAction } from "@/lib/actions/reports";
import Link from "next/link";
import { use } from "react";

const reportAreaOptions = [
  { value: "SOCIAL_INTEGRATION", label: "Integración social" },
  { value: "LABOR_INTEGRATION", label: "Integración laboral" },
  { value: "EDUCATIONAL_INTEGRATION", label: "Integración educativa" },
  { value: "FAMILY_INTEGRATION", label: "Integración familiar" },
  { value: "AUTONOMY", label: "Autonomía" },
];

const progressScaleOptions = [
  { value: "INITIAL", label: "Inicial" },
  { value: "IN_DEVELOPMENT", label: "En desarrollo" },
  { value: "ACHIEVED", label: "Alcanzado" },
];

export default function NuevoInformePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: patientId } = use(params);
  const [state, action, pending] = useActionState(createReportAction, null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/pacientes/${patientId}`}
          className="p-2 hover:bg-warm-100 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">Nuevo informe</h1>
      </div>

      <form action={action} className="space-y-6">
        <input type="hidden" name="patientId" value={patientId} />

        {state?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">Período</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="periodStart" className="block text-sm font-medium text-warm-700 mb-1">
                Fecha de inicio *
              </label>
              <input
                id="periodStart"
                name="periodStart"
                type="date"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              />
            </div>
            <div>
              <label htmlFor="periodEnd" className="block text-sm font-medium text-warm-700 mb-1">
                Fecha de fin *
              </label>
              <input
                id="periodEnd"
                name="periodEnd"
                type="date"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">Clasificación</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-warm-700 mb-1">
                Área *
              </label>
              <select
                id="area"
                name="area"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              >
                <option value="">Seleccionar...</option>
                {reportAreaOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="progressScale" className="block text-sm font-medium text-warm-700 mb-1">
                Escala de progreso *
              </label>
              <select
                id="progressScale"
                name="progressScale"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              >
                <option value="">Seleccionar...</option>
                {progressScaleOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">Contenido</h2>
          <TextArea label="Observaciones *" name="observations" required />
          <TextArea label="Recomendaciones *" name="recommendations" required />
          <TextArea label="Próximos objetivos *" name="nextObjectives" required />
        </section>

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
            {pending ? "Guardando..." : "Guardar informe"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TextArea({
  label,
  name,
  required = false,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-warm-700 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={4}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y"
      />
    </div>
  );
}
