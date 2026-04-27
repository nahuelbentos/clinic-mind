"use client";

import { useActionState, useTransition } from "react";
import { updateProfileAction, updateLocaleAction } from "@/lib/actions/profile";
import { useTranslations } from "next-intl";

export default function ProfileForm({
  defaultValues,
}: {
  defaultValues: {
    name: string;
    profession: string;
    licenseNumber: string;
    locale: string;
  };
}) {
  const [state, action, pending] = useActionState(updateProfileAction, null);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("profile");

  function handleLocaleChange(locale: "es" | "en") {
    startTransition(async () => {
      await updateLocaleAction(locale);
    });
  }

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-5">
        {state?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{state.error}</div>
        )}
        {state?.success && (
          <div className="bg-sage-50 text-sage-700 px-4 py-3 rounded-lg text-sm">{t("saved")}</div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-warm-700 mb-1">{t("name")}</label>
          <input id="name" name="name" type="text" required defaultValue={defaultValues.name} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
        </div>

        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-warm-700 mb-1">{t("profession")}</label>
          <input id="profession" name="profession" type="text" defaultValue={defaultValues.profession} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
        </div>

        <div>
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-warm-700 mb-1">{t("licenseNumber")}</label>
          <input id="licenseNumber" name="licenseNumber" type="text" defaultValue={defaultValues.licenseNumber} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={pending} className="px-6 py-2.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition text-sm font-medium disabled:opacity-50">
            {pending ? t("saving") : t("save")}
          </button>
        </div>
      </form>

      {/* Language / Idioma */}
      <div className="border-t border-warm-100 pt-6">
        <p className="text-sm font-medium text-warm-700 mb-3">{t("language")}</p>
        <div className="flex gap-3">
          <button
            onClick={() => handleLocaleChange("es")}
            disabled={isPending || defaultValues.locale === "es"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${defaultValues.locale === "es" ? "bg-sage-600 text-white border-sage-600" : "border-warm-300 text-warm-700 hover:bg-warm-100"} disabled:opacity-50`}
          >
            {t("languageEs")}
          </button>
          <button
            onClick={() => handleLocaleChange("en")}
            disabled={isPending || defaultValues.locale === "en"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${defaultValues.locale === "en" ? "bg-sage-600 text-white border-sage-600" : "border-warm-300 text-warm-700 hover:bg-warm-100"} disabled:opacity-50`}
          >
            {t("languageEn")}
          </button>
        </div>
      </div>
    </div>
  );
}
