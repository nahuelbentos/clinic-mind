"use client";

import { useActionState } from "react";
import { createGoalAction } from "@/lib/actions/goals";
import { Link } from "@/i18n/navigation";
import { use } from "react";
import { useTranslations } from "next-intl";

export default function NuevoObjetivoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: patientId } = use(params);
  const [state, action, pending] = useActionState(createGoalAction, null);
  const t = useTranslations("newGoal");

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
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-warm-700 mb-1">{t("description")}</label>
            <textarea id="description" name="description" rows={3} required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" />
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-warm-700 mb-1">{t("area")}</label>
            <select id="area" name="area" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
              <option value="">{t("selectArea")}</option>
              <option value="SOCIAL">{t("areaOptions.SOCIAL")}</option>
              <option value="LABOR">{t("areaOptions.LABOR")}</option>
              <option value="EDUCATIONAL">{t("areaOptions.EDUCATIONAL")}</option>
              <option value="FAMILY">{t("areaOptions.FAMILY")}</option>
            </select>
          </div>

          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-warm-700 mb-1">{t("targetDate")}</label>
            <input id="targetDate" name="targetDate" type="date" className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-warm-700 mb-1">{t("notes")}</label>
            <textarea id="notes" name="notes" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" />
          </div>
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
