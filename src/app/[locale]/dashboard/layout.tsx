import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-warm-50 flex">
      <Sidebar userName={session.user.name ?? ""} userEmail={session.user.email ?? ""} />
      <main className="flex-1 lg:ml-64 p-6 pt-20 lg:pt-6">{children}</main>
    </div>
  );
}
