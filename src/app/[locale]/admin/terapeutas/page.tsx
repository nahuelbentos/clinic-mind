import { prisma } from "@/lib/prisma";
import { toggleUserActive, updateUserPlanAction, updateTherapistSpecialty } from "@/lib/actions/admin";
import { getTranslations } from "next-intl/server";

export default async function TerapeutasPage() {
  const therapists = await prisma.user.findMany({
    where: { role: "THERAPIST" },
    include: {
      patients: {
        where: { deletedAt: null },
        select: { _count: { select: { sessions: { where: { deletedAt: null } } } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const t = await getTranslations("admin.terapeutas");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-warm-900">{t("title")}</h1>

      <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-warm-50 border-b border-warm-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-warm-700">{t("name")}</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">{t("email")}</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">{t("specialty")}</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">{t("plan")}</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">{t("active")}</th>
              <th className="text-right px-4 py-3 font-medium text-warm-700">{t("patients")}</th>
              <th className="text-right px-4 py-3 font-medium text-warm-700">{t("sessions")}</th>
              <th className="text-left px-4 py-3 font-medium text-warm-700">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-100">
            {therapists.map((th) => {
              const sessionCount = th.patients.reduce((acc, p) => acc + p._count.sessions, 0);
              const boundToggle = toggleUserActive.bind(null, th.id);
              return (
                <tr key={th.id} className="hover:bg-warm-50 transition">
                  <td className="px-4 py-3 font-medium text-warm-900">{th.name}</td>
                  <td className="px-4 py-3 text-warm-600">{th.email}</td>
                  <td className="px-4 py-3">
                    <form action={updateTherapistSpecialty} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={th.id} />
                      <select name="specialty" defaultValue={th.specialty} className="px-2 py-1 rounded-lg border border-warm-300 text-xs focus:ring-2 focus:ring-sage-500 outline-none">
                        <option value="CLINICAL_PSYCHOLOGY">{t("clinicalPsychology")}</option>
                        <option value="SOCIAL_INTEGRATION">{t("socialIntegration")}</option>
                      </select>
                      <button type="submit" className="text-xs px-2 py-1 bg-lilac-100 text-lilac-700 rounded hover:bg-lilac-200 transition">{t("save")}</button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateUserPlanAction} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={th.id} />
                      <select name="plan" defaultValue={th.plan} className="px-2 py-1 rounded-lg border border-warm-300 text-xs focus:ring-2 focus:ring-sage-500 outline-none">
                        <option value="FREE">Free</option>
                        <option value="PRO">Pro</option>
                      </select>
                      <button type="submit" className="text-xs px-2 py-1 bg-sage-100 text-sage-700 rounded hover:bg-sage-200 transition">{t("save")}</button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${th.isActive ? "bg-sage-100 text-sage-700" : "bg-red-100 text-red-700"}`}>
                      {th.isActive ? t("yes") : t("no")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-warm-700">{th.patients.length}</td>
                  <td className="px-4 py-3 text-right text-warm-700">{sessionCount}</td>
                  <td className="px-4 py-3">
                    <form action={boundToggle}>
                      <button type="submit" className="text-xs px-3 py-1.5 rounded-lg border border-warm-300 text-warm-700 hover:bg-warm-100 transition">
                        {th.isActive ? t("deactivate") : t("activate")}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {therapists.length === 0 && (
          <p className="text-center text-warm-500 py-12">{t("noTherapists")}</p>
        )}
      </div>
    </div>
  );
}
