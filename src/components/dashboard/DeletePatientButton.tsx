"use client";

import { deletePatient } from "@/lib/actions/patients";
import { useTranslations } from "next-intl";

export default function DeletePatientButton({ patientId }: { patientId: string }) {
  const t = useTranslations("patients");

  async function handleDelete() {
    if (!confirm(t("deleteConfirm"))) return;
    const result = await deletePatient(patientId);
    if (result?.error) alert(result.error);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition shrink-0"
    >
      {t("delete")}
    </button>
  );
}
