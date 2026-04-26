"use client";

import { useState, useTransition } from "react";
import { updatePatientStatusAction } from "@/lib/actions/patients";

const statuses = [
  { value: "ACTIVE" as const, label: "Activo" },
  { value: "PAUSED" as const, label: "Pausado" },
  { value: "DISCHARGED" as const, label: "Alta" },
];

export default function StatusChanger({
  patientId,
  currentStatus,
}: {
  patientId: string;
  currentStatus: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="px-3 py-2 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition text-sm disabled:opacity-50"
      >
        Cambiar estado
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-warm-200 rounded-lg shadow-lg z-10">
          {statuses
            .filter((s) => s.value !== currentStatus)
            .map((s) => (
              <button
                key={s.value}
                className="w-full text-left px-4 py-2.5 text-sm text-warm-700 hover:bg-warm-50 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => {
                  setOpen(false);
                  startTransition(() => {
                    updatePatientStatusAction(patientId, s.value);
                  });
                }}
              >
                {s.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
