"use client";

import { useState, useTransition } from "react";
import { updatePatientStatusAction } from "@/lib/actions/patients";
import { useTranslations } from "next-intl";

const statusValues = ["ACTIVE", "PAUSED", "DISCHARGED"] as const;

export default function StatusChanger({
  patientId,
  currentStatus,
}: {
  patientId: string;
  currentStatus: string;
}) {
  const t = useTranslations("patientDetail");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const statusLabels: Record<string, string> = {
    ACTIVE: t("statusActive"),
    PAUSED: t("statusPaused"),
    DISCHARGED: t("statusDischarged"),
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="px-3 py-2 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition text-sm disabled:opacity-50"
      >
        {t("changeStatus")}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-warm-200 rounded-lg shadow-lg z-10">
          {statusValues
            .filter((v) => v !== currentStatus)
            .map((v) => (
              <button
                key={v}
                className="w-full text-left px-4 py-2.5 text-sm text-warm-700 hover:bg-warm-50 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => {
                  setOpen(false);
                  startTransition(() => {
                    updatePatientStatusAction(patientId, v);
                  });
                }}
              >
                {statusLabels[v]}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
