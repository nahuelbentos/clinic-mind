"use client";

import { useActionState } from "react";
import { createPatientAction } from "@/lib/actions/patients";
import Link from "next/link";

export default function NuevoPacientePage() {
  const [state, action, pending] = useActionState(createPatientAction, null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/pacientes"
          className="p-2 hover:bg-warm-100 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">Nuevo paciente</h1>
      </div>

      <form action={action} className="space-y-8">
        {state?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        {/* Basic info */}
        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">Información básica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre *" name="firstName" required />
            <Field label="Apellido *" name="lastName" required />
            <Field label="Email" name="email" type="email" />
            <Field label="Teléfono" name="phone" type="tel" />
            <Field label="Fecha de nacimiento" name="birthDate" type="date" />
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Género</label>
              <select
                name="gender"
                className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
              >
                <option value="">Seleccionar...</option>
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
                <option value="non-binary">No binario</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <Field label="Derivado por" name="referredBy" />
            <Field label="Contacto de emergencia" name="emergencyContact" />
          </div>
        </section>

        {/* Clinical profile */}
        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">Perfil clínico</h2>
          <TextArea label="Motivo de consulta" name="consultationReason" />
          <TextArea label="Antecedentes" name="background" />
          <TextArea label="Medicación actual" name="currentMedication" />
          <TextArea label="Terapia previa" name="previousTherapy" />
          <TextArea label="Valores ACT" name="actValues" />
        </section>

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/pacientes"
            className="px-6 py-2.5 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition text-sm font-medium"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-2.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition text-sm font-medium disabled:opacity-50"
          >
            {pending ? "Guardando..." : "Guardar paciente"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-warm-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
      />
    </div>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-warm-700 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y"
      />
    </div>
  );
}
