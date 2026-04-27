"use client";

import { useActionState } from "react";
import { createReportAction } from "@/lib/actions/reports";
import { Link } from "@/i18n/navigation";
import { use } from "react";
import { useTranslations } from "next-intl";

export default function NuevoInformePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: patientId } = use(params);
  const [state, action, pending] = useActionState(createReportAction, null);
  const t = useTranslations("newReport");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/pacientes/${patientId}`} className="p-2 hover:bg-warm-100 rounded-lg transition">
          <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">{t("title")}</h1>
      </div>

      <form action={action} className="space-y-6">
        <input type="hidden" name="patientId" value={patientId} />
        {state?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{state.error}</div>
        )}

        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">{t("period")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="periodStart" className="block text-sm font-medium text-warm-700 mb-1">{t("periodStart")}</label>
              <input id="periodStart" name="periodStart" type="date" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="periodEnd" className="block text-sm font-medium text-warm-700 mb-1">{t("periodEnd")}</label>
              <input id="periodEnd" name="periodEnd" type="date" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">{t("classification")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-warm-700 mb-1">{t("area")}</label>
              <select id="area" name="area" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
                <option value="">{t("selectArea")}</option>
                <option value="SOCIAL_INTEGRATION">{t("areaOptions.SOCIAL_INTEGRATION")}</option>
                <option value="LABOR_INTEGRATION">{t("areaOptions.LABOR_INTEGRATION")}</option>
                <option value="EDUCATIONAL_INTEGRATION">{t("areaOptions.EDUCATIONAL_INTEGRATION")}</option>
                <option value="FAMILY_INTEGRATION">{t("areaOptions.FAMILY_INTEGRATION")}</option>
                <option value="AUTONOMY">{t("areaOptions.AUTONOMY")}</option>
              </select>
            </div>
            <div>
              <label htmlFor="progressScale" className="block text-sm font-medium text-warm-700 mb-1">{t("progressScale")}</label>
              <select id="progressScale" name="progressScale" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
                <option value="">{t("selectArea")}</option>
                <option value="INITIAL">{t("progressOptions.INITIAL")}</option>
                <option value="IN_DEVELOPMENT">{t("progressOptions.IN_DEVELOPMENT")}</option>
                <option value="ACHIEVED">{t("progressOptions.ACHIEVED")}</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">{t("content")}</h2>
          <TextArea label={t("observations")} name="observations" required />
          <TextArea label={t("recommendations")} name="recommendations" required />
          <TextArea label={t("nextObjectives")} name="nextObjectives" required />
        </section>

        <div className="flex justify-end gap-3">
          <Link href={`/dashboard/pacientes/${patientId}`} className="px-6 py-2.5 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition text-sm font-medium">
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

function TextArea({ label, name, required = false }: { label: string; name: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-warm-700 mb-1">{label}</label>
      <textarea id={name} name={name} rows={4} required={required} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" />
    </div>
  );
}
