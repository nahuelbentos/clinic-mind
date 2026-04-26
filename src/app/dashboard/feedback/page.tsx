"use client";

import { useActionState } from "react";
import { createFeedbackAction } from "@/lib/actions/feedback";

export default function FeedbackPage() {
  const [state, action, pending] = useActionState(createFeedbackAction, null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warm-900">Feedback</h1>
        <p className="text-warm-600 mt-1">
          Reportá un problema o sugerí una mejora
        </p>
      </div>

      <form action={action} className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
        {state?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="bg-sage-50 text-sage-700 px-4 py-3 rounded-lg text-sm">
            Feedback enviado. ¡Gracias por tu aporte!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-warm-700 mb-1">
              Tipo
            </label>
            <select
              id="type"
              name="type"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
            >
              <option value="BUG">Bug / Error</option>
              <option value="FEATURE_REQUEST">Nueva funcionalidad</option>
              <option value="IMPROVEMENT">Mejora</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-warm-700 mb-1">
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue="MEDIUM"
              className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-warm-700 mb-1">
            Título *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm"
            placeholder="Resumen breve del feedback"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-warm-700 mb-1">
            Descripción *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y"
            placeholder="Describí el problema o sugerencia en detalle..."
          />
        </div>

        <div>
          <label htmlFor="currentBehavior" className="block text-sm font-medium text-warm-700 mb-1">
            Comportamiento actual <span className="text-warm-400">(opcional)</span>
          </label>
          <textarea
            id="currentBehavior"
            name="currentBehavior"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y"
            placeholder="¿Qué sucede actualmente?"
          />
        </div>

        <div>
          <label htmlFor="desiredBehavior" className="block text-sm font-medium text-warm-700 mb-1">
            Comportamiento deseado <span className="text-warm-400">(opcional)</span>
          </label>
          <textarea
            id="desiredBehavior"
            name="desiredBehavior"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y"
            placeholder="¿Qué esperarías que suceda?"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-2.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition text-sm font-medium disabled:opacity-50"
          >
            {pending ? "Enviando..." : "Enviar feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
