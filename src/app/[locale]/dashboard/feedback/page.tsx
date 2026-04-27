"use client";

import { useActionState } from "react";
import { createFeedbackAction } from "@/lib/actions/feedback";
import { useTranslations } from "next-intl";

export default function FeedbackPage() {
  const [state, action, pending] = useActionState(createFeedbackAction, null);
  const t = useTranslations("feedback");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warm-900">{t("title")}</h1>
        <p className="text-warm-600 mt-1">{t("subtitle")}</p>
      </div>

      <form action={action} className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
        {state?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{state.error}</div>
        )}
        {state?.success && (
          <div className="bg-sage-50 text-sage-700 px-4 py-3 rounded-lg text-sm">{t("sent")}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-warm-700 mb-1">{t("type")}</label>
            <select id="type" name="type" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
              <option value="BUG">{t("typeBug")}</option>
              <option value="FEATURE_REQUEST">{t("typeFeature")}</option>
              <option value="IMPROVEMENT">{t("typeImprovement")}</option>
              <option value="OTHER">{t("typeOther")}</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-warm-700 mb-1">{t("priority")}</label>
            <select id="priority" name="priority" defaultValue="MEDIUM" className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
              <option value="LOW">{t("priorityLow")}</option>
              <option value="MEDIUM">{t("priorityMedium")}</option>
              <option value="HIGH">{t("priorityHigh")}</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-warm-700 mb-1">{t("titleField")}</label>
          <input id="title" name="title" type="text" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" placeholder={t("titlePlaceholder")} />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-warm-700 mb-1">{t("description")}</label>
          <textarea id="description" name="description" required rows={4} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" placeholder={t("descriptionPlaceholder")} />
        </div>

        <div>
          <label htmlFor="currentBehavior" className="block text-sm font-medium text-warm-700 mb-1">
            {t("currentBehavior")} <span className="text-warm-400">{t("optional")}</span>
          </label>
          <textarea id="currentBehavior" name="currentBehavior" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" placeholder={t("currentBehaviorPlaceholder")} />
        </div>

        <div>
          <label htmlFor="desiredBehavior" className="block text-sm font-medium text-warm-700 mb-1">
            {t("desiredBehavior")} <span className="text-warm-400">{t("optional")}</span>
          </label>
          <textarea id="desiredBehavior" name="desiredBehavior" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" placeholder={t("desiredBehaviorPlaceholder")} />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={pending} className="px-6 py-2.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition text-sm font-medium disabled:opacity-50">
            {pending ? t("sending") : t("send")}
          </button>
        </div>
      </form>
    </div>
  );
}
