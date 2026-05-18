import { Link } from "@/i18n/navigation";
import BlogForm from "@/components/admin/BlogForm";

export const metadata = { title: "Nuevo artículo — Admin" };

export default function AdminBlogNuevoPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-700 transition mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al blog
        </Link>
        <h1 className="text-2xl font-bold text-warm-900">Nuevo artículo</h1>
      </div>
      <BlogForm mode="create" />
    </div>
  );
}
