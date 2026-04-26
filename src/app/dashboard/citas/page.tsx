import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Link from "next/link";
import NewAppointmentForm from "@/components/dashboard/NewAppointmentForm";

export default async function CitasPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const db = getDb(session.user.id);

  const [appointments, patients] = await Promise.all([
    db.appointment.findMany({
      where: {
        patient: { userId: session.user.id },
        scheduledAt: { gte: new Date() },
        status: { not: "CANCELLED" },
      },
      include: { patient: true },
      orderBy: { scheduledAt: "asc" },
    }),
    db.patient.findMany({
      where: { userId: session.user.id, status: "ACTIVE" },
      orderBy: { lastName: "asc" },
    }),
  ]);

  const statusLabels: Record<string, { label: string; style: string }> = {
    CONFIRMED: { label: "Confirmada", style: "bg-sage-100 text-sage-700" },
    PENDING: { label: "Pendiente", style: "bg-cream-100 text-cream-700" },
    CANCELLED: { label: "Cancelada", style: "bg-red-100 text-red-700" },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-warm-900">Próximas citas</h1>

      <NewAppointmentForm
        patients={patients.map((p) => ({
          id: p.id,
          name: `${p.firstName} ${p.lastName}`,
        }))}
      />

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
          <p className="text-warm-500">No hay citas próximas.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-warm-200 divide-y divide-warm-100">
          {appointments.map((apt) => {
            const si = statusLabels[apt.status];
            return (
              <div key={apt.id} className="flex items-center gap-4 p-4">
                <div className="w-11 h-11 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center text-sm font-semibold shrink-0">
                  {apt.patient.firstName[0]}
                  {apt.patient.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/pacientes/${apt.patientId}`}
                    className="text-sm font-medium text-warm-900 hover:text-sage-700"
                  >
                    {apt.patient.firstName} {apt.patient.lastName}
                  </Link>
                  <p className="text-xs text-warm-500">
                    {new Date(apt.scheduledAt).toLocaleDateString("es-AR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}{" "}
                    a las{" "}
                    {new Date(apt.scheduledAt).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${si.style}`}>
                  {si.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
