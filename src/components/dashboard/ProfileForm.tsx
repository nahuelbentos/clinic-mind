"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";

export default function ProfileForm({
  defaultValues,
}: {
  defaultValues: {
    name: string;
    profession: string;
    licenseNumber: string;
  };
}) {
  const [state, action, pending] = useActionState(updateProfileAction, null);

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-sage-50 text-sage-700 px-4 py-3 rounded-lg text-sm">
          Perfil actualizado correctamente.
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-warm-700 mb-1">
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues.name}
          className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
        />
      </div>

      <div>
        <label htmlFor="profession" className="block text-sm font-medium text-warm-700 mb-1">
          Profesión
        </label>
        <input
          id="profession"
          name="profession"
          type="text"
          defaultValue={defaultValues.profession}
          className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
        />
      </div>

      <div>
        <label htmlFor="licenseNumber" className="block text-sm font-medium text-warm-700 mb-1">
          Matrícula
        </label>
        <input
          id="licenseNumber"
          name="licenseNumber"
          type="text"
          defaultValue={defaultValues.licenseNumber}
          className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition text-sm font-medium disabled:opacity-50"
        >
          {pending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
