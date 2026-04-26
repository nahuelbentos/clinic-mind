import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const db = getDb(session.user.id);

  const [activePatients, sessionsThisMonth, pendingPayments, todayAppointments] =
    await Promise.all([
      db.patient.count({
        where: { userId: session.user.id, status: "ACTIVE" },
      }),
      db.session.count({
        where: {
          patient: { userId: session.user.id },
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      db.session.count({
        where: {
          patient: { userId: session.user.id },
          paymentStatus: "PENDING",
        },
      }),
      db.appointment.findMany({
        where: {
          patient: { userId: session.user.id },
          status: "CONFIRMED",
          scheduledAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
        include: { patient: true },
        orderBy: { scheduledAt: "asc" },
      }),
    ]);

  const recentSessions = await db.session.findMany({
    where: { patient: { userId: session.user.id } },
    include: { patient: true },
    orderBy: { date: "desc" },
    take: 5,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-warm-900">
          Hola, {session.user.name.split(" ")[0]}
        </h1>
        <p className="text-warm-600 mt-1">Resumen de tu actividad</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Pacientes activos"
          value={activePatients}
          color="sage"
        />
        <StatCard
          label="Sesiones este mes"
          value={sessionsThisMonth}
          color="lilac"
        />
        <StatCard
          label="Pagos pendientes"
          value={pendingPayments}
          color="cream"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <div className="bg-white rounded-2xl border border-warm-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-warm-900">Citas de hoy</h2>
            <Link
              href="/dashboard/citas"
              className="text-sm text-sage-600 hover:text-sage-700"
            >
              Ver todas
            </Link>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="text-warm-500 text-sm py-4">
              No hay citas programadas para hoy.
            </p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-warm-50"
                >
                  <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center text-sm font-semibold">
                    {apt.patient.firstName[0]}
                    {apt.patient.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-warm-900">
                      {apt.patient.firstName} {apt.patient.lastName}
                    </p>
                    <p className="text-xs text-warm-500">
                      {new Date(apt.scheduledAt).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent sessions */}
        <div className="bg-white rounded-2xl border border-warm-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-warm-900">
              Sesiones recientes
            </h2>
            <Link
              href="/dashboard/pacientes"
              className="text-sm text-sage-600 hover:text-sage-700"
            >
              Ver pacientes
            </Link>
          </div>
          {recentSessions.length === 0 ? (
            <p className="text-warm-500 text-sm py-4">
              Aún no hay sesiones registradas.
            </p>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/pacientes/${s.patientId}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-warm-50 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-lilac-100 text-lilac-700 flex items-center justify-center text-sm font-semibold">
                    #{s.sessionNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warm-900 truncate">
                      {s.patient.firstName} {s.patient.lastName}
                    </p>
                    <p className="text-xs text-warm-500">
                      {new Date(s.date).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <PaymentBadge status={s.paymentStatus} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "sage" | "lilac" | "cream";
}) {
  const colors = {
    sage: "bg-sage-50 border-sage-200 text-sage-700",
    lilac: "bg-lilac-50 border-lilac-200 text-lilac-700",
    cream: "bg-cream-50 border-cream-200 text-cream-700",
  };

  return (
    <div className={`rounded-2xl border p-6 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-sage-100 text-sage-700",
    PENDING: "bg-cream-100 text-cream-700",
    EXEMPT: "bg-warm-100 text-warm-600",
  };
  const labels: Record<string, string> = {
    PAID: "Pagado",
    PENDING: "Pendiente",
    EXEMPT: "Exento",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}
