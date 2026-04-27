"use client";

import { useActionState } from "react";
import { createPatientAction } from "@/lib/actions/patients";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NuevoPacienteForm({ specialty }: { specialty: string }) {
  const [state, action, pending] = useActionState(createPatientAction, null);
  const isSocialIntegration = specialty === "SOCIAL_INTEGRATION";
  const t = useTranslations("newPatient");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pacientes" className="p-2 hover:bg-warm-100 rounded-lg transition">
          <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">{t("title")}</h1>
      </div>

      <form action={action} className="space-y-8">
        {state?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{state.error}</div>
        )}

        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">{t("basicInfo")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t("firstName")} name="firstName" required />
            <Field label={t("lastName")} name="lastName" required />
            <Field label={t("email")} name="email" type="email" />
            <Field label={t("phone")} name="phone" type="tel" />
            <Field label={t("birthDate")} name="birthDate" type="date" />
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">{t("gender")}</label>
              <select name="gender" className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
                <option value="">{t("selectGender")}</option>
                <option value="female">{t("female")}</option>
                <option value="male">{t("male")}</option>
                <option value="non-binary">{t("nonBinary")}</option>
                <option value="other">{t("other")}</option>
              </select>
            </div>
            <Field label={t("referredBy")} name="referredBy" />
            <Field label={t("emergencyContact")} name="emergencyContact" />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">{t("clinicalProfile")}</h2>
          <TextArea label={t("consultationReason")} name="consultationReason" />
          <TextArea label={t("background")} name="background" />
          <TextArea label={t("currentMedication")} name="currentMedication" />
          <TextArea label={t("previousTherapy")} name="previousTherapy" />
          {!isSocialIntegration && <TextArea label={t("actValues")} name="actValues" />}
        </section>

        {isSocialIntegration && (
          <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-warm-900">{t("socialIntegration")}</h2>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">{t("disabilityType")}</label>
              <select name="disabilityType" className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
                <option value="">{t("selectGender")}</option>
                <option value="MOTOR">{t("disabilityMotor")}</option>
                <option value="COGNITIVE">{t("disabilityCognitive")}</option>
                <option value="SENSORY">{t("disabilitySensory")}</option>
                <option value="MULTIPLE">{t("disabilityMultiple")}</option>
                <option value="OTHER">{t("disabilityOther")}</option>
              </select>
            </div>
            <Field label={t("autonomyLevel")} name="autonomyLevel" />
            <TextArea label={t("integrationContext")} name="integrationContext" />
          </section>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/pacientes" className="px-6 py-2.5 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition text-sm font-medium">
            {t("cancel")}
          </Link>
          <button type="submit" disabled={pending} className="px-6 py-2.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition text-sm font-medium disabled:opacity-50">
            {pending ? t("saving") : t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-warm-700 mb-1">{label}</label>
      <input id={name} name={name} type={type} required={required} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
    </div>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-warm-700 mb-1">{label}</label>
      <textarea id={name} name={name} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" />
    </div>
  );
}
