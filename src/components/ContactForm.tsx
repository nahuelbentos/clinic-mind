"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");

    // Build a WhatsApp message as fallback (no backend needed)
    const msg = encodeURIComponent(
      `Hola Micaela, me contacto desde el formulario de tu web.\n\nNombre: ${formData.nombre}\nEmail: ${formData.email}\n\n${formData.mensaje}`
    );
    window.open(`https://wa.me/5491100000000?text=${msg}`, "_blank");

    setState("success");
    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-warm-700 mb-1.5"
        >
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          className="w-full bg-warm-50 border border-warm-200 text-warm-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 transition-all placeholder:text-warm-300"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-warm-700 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          className="w-full bg-warm-50 border border-warm-200 text-warm-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 transition-all placeholder:text-warm-300"
        />
      </div>

      <div>
        <label
          htmlFor="mensaje"
          className="block text-sm font-medium text-warm-700 mb-1.5"
        >
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={5}
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="¿En qué puedo ayudarte? Contame lo que necesités..."
          className="w-full bg-warm-50 border border-warm-200 text-warm-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 transition-all placeholder:text-warm-300 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full bg-sage-500 hover:bg-sage-600 disabled:bg-sage-300 text-white font-medium px-6 py-3.5 rounded-full transition-colors shadow-md hover:shadow-lg text-sm"
      >
        {state === "submitting" ? "Enviando..." : "Enviar mensaje por WhatsApp"}
      </button>

      {state === "success" && (
        <p className="text-sage-700 bg-sage-50 border border-sage-200 rounded-xl p-4 text-sm text-center">
          ¡Se abrió WhatsApp con tu mensaje! Si no se abrió, escribime directamente.
        </p>
      )}
      {state === "error" && (
        <p className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-center">
          Hubo un problema. Por favor, escribime directamente por WhatsApp.
        </p>
      )}

      <p className="text-xs text-warm-400 text-center">
        Al enviar, se abrirá WhatsApp con tu consulta precompletada.
      </p>
    </form>
  );
}
