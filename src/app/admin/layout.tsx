import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/admin/terapeutas", label: "Terapeutas" },
  { href: "/admin/feature-flags", label: "Feature Flags" },
  { href: "/admin/feedback", label: "Feedback" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-warm-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-warm-200 fixed inset-y-0 left-0 flex flex-col">
        <div className="p-6 border-b border-warm-200">
          <p className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
            Admin
          </p>
          <h1 className="text-lg font-bold text-warm-900 mt-1">ClinicMind</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-warm-700 hover:bg-warm-100 hover:text-warm-900 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-warm-200">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-warm-500 hover:text-warm-700 transition"
          >
            ← Volver al dashboard
          </Link>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  );
}
