"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  const t = useTranslations("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-warm-900">{t("title")}</h1>
          <p className="text-warm-600 mt-2">{t("subtitle")}</p>
        </div>

        <form action={action} className="bg-white rounded-2xl shadow-sm border border-warm-200 p-8 space-y-5">
          {state?.error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{state.error}</div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-1">{t("email")}</label>
            <input id="email" name="email" type="email" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="tu@email.com" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-warm-700 mb-1">{t("password")}</label>
            <input id="password" name="password" type="password" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" placeholder="••••••" />
          </div>

          <button type="submit" disabled={pending} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50">
            {pending ? t("submitting") : t("submit")}
          </button>

          <p className="text-center text-sm text-warm-600">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-brand-600 hover:text-brand-700 font-medium">
              {t("register")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
