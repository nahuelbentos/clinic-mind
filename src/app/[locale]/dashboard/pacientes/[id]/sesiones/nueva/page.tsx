"use client";

import { useActionState, useState } from "react";
import { useParams } from "next/navigation";
import { createSessionAction } from "@/lib/actions/sessions";
import { Link } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-48 bg-warm-50 rounded-lg border border-warm-300 animate-pulse" />,
});

export default function NuevaSesionPage() {
  const params = useParams();
  const patientId = params.id as string;
  const [notes, setNotes] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const t = useTranslations("newSession");

  const boundAction = createSessionAction.bind(null, patientId);
  const [state, action, pending] = useActionState(boundAction, null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/pacientes/${patientId}`} className="p-2 hover:bg-warm-100 rounded-lg transition">
          <svg className="w-5 h-5 text-warm-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">{t("title")}</h1>
      </div>

      <form action={action} className="space-y-6">
        {state?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{state.error}</div>
        )}
        <input type="hidden" name="notes" value={notes} />

        <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">{t("details")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-warm-700 mb-1">{t("date")}</label>
              <input id="date" name="date" type="datetime-local" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="sessionNumber" className="block text-sm font-medium text-warm-700 mb-1">{t("sessionNumber")}</label>
              <input id="sessionNumber" name="sessionNumber" type="number" min={1} required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-warm-700 mb-1">{t("duration")}</label>
              <input id="duration" name="duration" type="number" defaultValue={50} min={1} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-warm-700 mb-1">{t("status")}</label>
              <select id="status" name="status" defaultValue="COMPLETED" className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
                <option value="COMPLETED">{t("completed")}</option>
                <option value="SCHEDULED">{t("scheduled")}</option>
                <option value="CANCELLED">{t("cancelled")}</option>
                <option value="NO_SHOW">{t("noShow")}</option>
              </select>
            </div>
            <div>
              <label htmlFor="paymentStatus" className="block text-sm font-medium text-warm-700 mb-1">{t("paymentStatus")}</label>
              <select id="paymentStatus" name="paymentStatus" defaultValue="PENDING" className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
                <option value="PENDING">{t("pending")}</option>
                <option value="PAID">{t("paid")}</option>
                <option value="EXEMPT">{t("exempt")}</option>
              </select>
            </div>
            <div>
              <label htmlFor="paymentAmount" className="block text-sm font-medium text-warm-700 mb-1">{t("amount")}</label>
              <input id="paymentAmount" name="paymentAmount" type="number" step="0.01" min={0} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-warm-900">{t("onlineMeeting")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="meetLink" className="block text-sm font-medium text-warm-700 mb-1">{t("meetLink")}</label>
              <input id="meetLink" name="meetLink" type="url" value={meetLink} onChange={(e) => setMeetLink(e.target.value)} placeholder="https://meet.google.com/..." className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
            </div>
            <div>
              <label htmlFor="meetProvider" className="block text-sm font-medium text-warm-700 mb-1">{t("platform")}</label>
              <select id="meetProvider" name="meetProvider" disabled={!meetLink} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm disabled:opacity-50 disabled:bg-warm-50">
                <option value="">{t("selectPlatform")}</option>
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="ZOOM">Zoom</option>
                <option value="TEAMS">Teams</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-warm-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-warm-900">{t("sessionNotes")}</h2>
          <div data-color-mode="light">
            <MDEditor value={notes} onChange={(val) => setNotes(val || "")} height={300} preview="edit" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-warm-200 p-6">
          <label htmlFor="nextSessionGoal" className="block text-sm font-medium text-warm-700 mb-1">{t("nextGoal")}</label>
          <textarea id="nextSessionGoal" name="nextSessionGoal" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" />
        </div>

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
