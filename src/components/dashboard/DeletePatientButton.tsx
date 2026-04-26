"use client";

import { deletePatient } from "@/lib/actions/patients";

export default function DeletePatientButton({ patientId }: { patientId: string }) {
  async function handleDelete() {
    if (!confirm("¿Eliminar este paciente? Esta acción no se puede deshacer."))
      return;
    const result = await deletePatient(patientId);
    if (result?.error) alert(result.error);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition shrink-0"
    >
      Eliminar
    </button>
  );
}
