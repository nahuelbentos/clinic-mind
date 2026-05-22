"use client";

import { useRef, useState, useTransition } from "react";
import { createFeedbackAction } from "@/lib/actions/feedback";
import { useTranslations } from "next-intl";

export default function FeedbackPage() {
  const t = useTranslations("feedback");
  const [serverState, setServerState] = useState<{ error?: string; success?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    const existingNames = new Set(files.map((f) => f.name));
    const newFiles = selected.filter((f) => !existingNames.has(f.name));
    const combined = [...files, ...newFiles];
    if (combined.length > 5) {
      setUploadErrors(["Máximo 5 archivos permitidos"]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const newPreviews = newFiles.map((f) =>
      f.type.startsWith("image/") ? URL.createObjectURL(f) : ""
    );
    setFiles(combined);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setUploadErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveFile(index: number) {
    const preview = previews[index];
    if (preview) URL.revokeObjectURL(preview);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerState(null);
    setUploadErrors([]);

    const form = e.currentTarget;
    const formData = new FormData(form);
    let urls: string[] = [];

    if (files.length > 0) {
      setIsUploading(true);
      try {
        urls = await Promise.all(
          files.map(async (file) => {
            const uploadData = new FormData();
            uploadData.set("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: uploadData });
            const json = (await res.json()) as { url?: string; error?: string };
            if (!res.ok || json.error) throw new Error(json.error ?? "Error al subir archivo");
            return json.url!;
          })
        );
      } catch (err) {
        setUploadErrors([err instanceof Error ? err.message : "Error al subir archivos"]);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    formData.set("attachmentUrls", JSON.stringify(urls));

    startTransition(async () => {
      const result = await createFeedbackAction(null, formData);
      setServerState(result);
      if (result?.success) {
        formRef.current?.reset();
        previews.forEach((p) => p && URL.revokeObjectURL(p));
        setFiles([]);
        setPreviews([]);
      }
    });
  }

  const busy = isUploading || isPending;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warm-900">{t("title")}</h1>
        <p className="text-warm-600 mt-1">{t("subtitle")}</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-2xl border border-warm-200 p-6 space-y-5">
        {serverState?.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{serverState.error}</div>
        )}
        {serverState?.success && (
          <div className="bg-sage-50 text-sage-700 px-4 py-3 rounded-lg text-sm">{t("sent")}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-warm-700 mb-1">{t("type")}</label>
            <select id="type" name="type" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
              <option value="BUG">{t("typeBug")}</option>
              <option value="FEATURE_REQUEST">{t("typeFeature")}</option>
              <option value="IMPROVEMENT">{t("typeImprovement")}</option>
              <option value="OTHER">{t("typeOther")}</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-warm-700 mb-1">{t("priority")}</label>
            <select id="priority" name="priority" defaultValue="MEDIUM" className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm">
              <option value="LOW">{t("priorityLow")}</option>
              <option value="MEDIUM">{t("priorityMedium")}</option>
              <option value="HIGH">{t("priorityHigh")}</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-warm-700 mb-1">{t("titleField")}</label>
          <input id="title" name="title" type="text" required className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm" placeholder={t("titlePlaceholder")} />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-warm-700 mb-1">{t("description")}</label>
          <textarea id="description" name="description" required rows={4} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" placeholder={t("descriptionPlaceholder")} />
        </div>

        <div>
          <label htmlFor="currentBehavior" className="block text-sm font-medium text-warm-700 mb-1">
            {t("currentBehavior")} <span className="text-warm-400">{t("optional")}</span>
          </label>
          <textarea id="currentBehavior" name="currentBehavior" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" placeholder={t("currentBehaviorPlaceholder")} />
        </div>

        <div>
          <label htmlFor="desiredBehavior" className="block text-sm font-medium text-warm-700 mb-1">
            {t("desiredBehavior")} <span className="text-warm-400">{t("optional")}</span>
          </label>
          <textarea id="desiredBehavior" name="desiredBehavior" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-warm-300 focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none text-sm resize-y" placeholder={t("desiredBehaviorPlaceholder")} />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-2">
            Adjuntos <span className="text-warm-400">{t("optional")}</span>
          </label>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {files.map((f, i) => (
                <div key={f.name} className="relative">
                  {previews[i] ? (
                    <img
                      src={previews[i]}
                      alt={f.name}
                      className="h-20 w-20 object-cover rounded-lg border border-warm-200"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-warm-200 bg-warm-50 text-sm text-warm-700 max-w-[180px]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warm-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="truncate">{f.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(i)}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                    aria-label={`Quitar ${f.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {files.length < 5 && (
            <label className="flex items-center gap-2 w-fit cursor-pointer px-4 py-2 rounded-lg border border-warm-300 text-sm text-warm-600 hover:bg-warm-50 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {files.length === 0 ? "Adjuntar archivo" : "Agregar más"}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/x-matroska"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          )}

          {isUploading && (
            <div className="mt-2 flex items-center gap-2 text-sm text-warm-500">
              <svg className="animate-spin h-4 w-4 text-sage-500 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Subiendo {files.length} archivo{files.length !== 1 ? "s" : ""}...
            </div>
          )}

          {uploadErrors.map((err, i) => (
            <p key={i} className="mt-2 text-sm text-red-600">{err}</p>
          ))}

          <p className="mt-1.5 text-xs text-warm-400">
            Hasta 5 archivos · Imágenes (JPEG, PNG, WebP) hasta 5MB · Videos MP4 hasta 50MB
          </p>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={busy} className="px-6 py-2.5 rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition text-sm font-medium disabled:opacity-50">
            {busy ? t("sending") : t("send")}
          </button>
        </div>
      </form>
    </div>
  );
}
