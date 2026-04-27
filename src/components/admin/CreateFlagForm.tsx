"use client";

import { useActionState } from "react";
import { createFeatureFlag } from "@/lib/actions/admin";
import { useTranslations } from "next-intl";

interface Therapist {
  id: string;
  name: string;
  email: string;
}

export default function CreateFlagForm({ therapists }: { therapists: Therapist[] }) {
  const tf = useTranslations("admin.flags");
  const [state, action, pending] = useActionState(createFeatureFlag, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-sage-700">{tf("created")}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-warm-700 mb-1">{tf("key")}</label>
          <select
            name="key"
            required
            className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm focus:ring-2 focus:ring-sage-500 outline-none"
          >
            <option value="">Seleccionar...</option>
            <option value="DELETE_PATIENTS">DELETE_PATIENTS</option>
            <option value="DELETE_SESSIONS">DELETE_SESSIONS</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-700 mb-1">{tf("scope")}</label>
          <select
            name="scope"
            required
            className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm focus:ring-2 focus:ring-sage-500 outline-none"
          >
            <option value="GLOBAL">GLOBAL</option>
            <option value="PER_USER">PER_USER</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-700 mb-1">
            {tf("userOnlyPer")}
          </label>
          <select
            name="userId"
            className="w-full px-3 py-2 rounded-lg border border-warm-300 text-sm focus:ring-2 focus:ring-sage-500 outline-none"
          >
            <option value="">{tf("none")}</option>
            {therapists.map((therapist) => (
              <option key={therapist.id} value={therapist.id}>
                {therapist.name} ({therapist.email})
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="px-4 py-2 rounded-lg bg-sage-600 hover:bg-sage-700 text-white text-sm font-medium transition disabled:opacity-50"
      >
        {pending ? tf("creating") : tf("create")}
      </button>
    </form>
  );
}
