"use client";

import { useState, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface BlogFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  published: boolean;
}

interface Props {
  initialData?: Partial<BlogFormData> & { id?: string };
  mode: "create" | "edit";
}

export default function BlogForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<BlogFormData>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    content: initialData?.content ?? "",
    author: initialData?.author ?? "",
    date: initialData?.date ?? new Date().toISOString().slice(0, 10),
    tags: initialData?.tags ?? [],
    published: initialData?.published ?? false,
  });

  const handleTitleChange = useCallback((title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? slugify(title) : prev.slug,
    }));
  }, [mode]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = mode === "edit" ? `/api/blog/${initialData!.id}` : "/api/blog";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error === "Slug already in use" ? "Ese slug ya está en uso." : "Error al guardar.");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Título + Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Título *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-3 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">
            Slug *
            <span className="text-xs text-warm-400 ml-1">(auto-generado, editable)</span>
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
            required
            className="w-full px-3 py-2 border border-warm-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-warm-700 mb-1">Descripción *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          required
          rows={2}
          className="w-full px-3 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-300 resize-none"
        />
      </div>

      {/* Autor + Fecha + Publicado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Autor *</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">Fecha *</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm((p) => ({ ...p, published: !p.published }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.published ? "bg-sage-500" : "bg-warm-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.published ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-sm font-medium text-warm-700">
              {form.published ? "Publicado" : "Borrador"}
            </span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-warm-700 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-sage-100 text-sage-700 text-xs px-2.5 py-1 rounded-full"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="Agregar tag y presionar Enter"
            className="flex-1 px-3 py-2 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-warm-100 text-warm-700 text-sm rounded-lg hover:bg-warm-200 transition"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Editor Markdown */}
      <div>
        <label className="block text-sm font-medium text-warm-700 mb-1">Contenido</label>
        <div data-color-mode="light">
          <MDEditor
            value={form.content}
            onChange={(val) => setForm((p) => ({ ...p, content: val ?? "" }))}
            height={480}
            preview="live"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3 pt-2 border-t border-warm-100">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-sage-500 hover:bg-sage-600 disabled:bg-sage-300 text-white text-sm font-medium rounded-lg transition"
        >
          {saving ? "Guardando..." : mode === "create" ? "Crear artículo" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="px-6 py-2.5 border border-warm-200 text-warm-700 text-sm font-medium rounded-lg hover:bg-warm-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
