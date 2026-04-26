"use server";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { feedbackSchema } from "@/lib/validations";
import { resend } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function createFeedbackAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  const raw = {
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    currentBehavior: formData.get("currentBehavior") as string,
    desiredBehavior: formData.get("desiredBehavior") as string,
    priority: formData.get("priority") as string,
  };

  const result = feedbackSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const db = getDb(session.user.id);

  const feedback = await db.feedback.create({
    data: {
      userId: session.user.id,
      type: result.data.type,
      title: result.data.title,
      description: result.data.description,
      currentBehavior: result.data.currentBehavior || null,
      desiredBehavior: result.data.desiredBehavior || null,
      priority: result.data.priority,
    },
  });

  // Send email notification
  const developerEmail = process.env.DEVELOPER_EMAIL;
  if (developerEmail) {
    const typeLabels: Record<string, string> = {
      BUG: "Bug",
      FEATURE_REQUEST: "Solicitud de funcionalidad",
      IMPROVEMENT: "Mejora",
      OTHER: "Otro",
    };
    const priorityLabels: Record<string, string> = {
      LOW: "Baja",
      MEDIUM: "Media",
      HIGH: "Alta",
    };

    try {
      await resend.emails.send({
        from: "ClinicMind <noreply@resend.dev>",
        to: developerEmail,
        subject: `[Feedback] ${result.data.title}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf9f7; padding: 32px; border-radius: 12px;">
            <h1 style="color: #2c2825; font-size: 20px; margin-bottom: 24px; border-bottom: 2px solid #e4efe4; padding-bottom: 12px;">
              Nuevo Feedback Recibido
            </h1>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 12px; color: #8d7a68; font-size: 14px; width: 140px;">Profesional</td>
                <td style="padding: 8px 12px; color: #2c2825; font-size: 14px;">${session.user.name} (${session.user.email})</td>
              </tr>
              <tr style="background: #f5f2ee;">
                <td style="padding: 8px 12px; color: #8d7a68; font-size: 14px;">Tipo</td>
                <td style="padding: 8px 12px; color: #2c2825; font-size: 14px;">${typeLabels[result.data.type]}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #8d7a68; font-size: 14px;">Prioridad</td>
                <td style="padding: 8px 12px; color: #2c2825; font-size: 14px;">${priorityLabels[result.data.priority]}</td>
              </tr>
              <tr style="background: #f5f2ee;">
                <td style="padding: 8px 12px; color: #8d7a68; font-size: 14px;">Título</td>
                <td style="padding: 8px 12px; color: #2c2825; font-size: 14px; font-weight: 600;">${result.data.title}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #ebe5dc;">
              <h3 style="color: #477347; font-size: 14px; margin: 0 0 8px;">Descripción</h3>
              <p style="color: #2c2825; font-size: 14px; line-height: 1.6; margin: 0;">${result.data.description}</p>
            </div>
            ${
              result.data.currentBehavior
                ? `
            <div style="margin-top: 12px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #ebe5dc;">
              <h3 style="color: #8d7a68; font-size: 14px; margin: 0 0 8px;">Comportamiento actual</h3>
              <p style="color: #2c2825; font-size: 14px; line-height: 1.6; margin: 0;">${result.data.currentBehavior}</p>
            </div>`
                : ""
            }
            ${
              result.data.desiredBehavior
                ? `
            <div style="margin-top: 12px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #ebe5dc;">
              <h3 style="color: #477347; font-size: 14px; margin: 0 0 8px;">Comportamiento deseado</h3>
              <p style="color: #2c2825; font-size: 14px; line-height: 1.6; margin: 0;">${result.data.desiredBehavior}</p>
            </div>`
                : ""
            }
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #ebe5dc; font-size: 12px; color: #8d7a68;">
              ID: ${feedback.id} · ${new Date().toLocaleDateString("es-AR")}
            </div>
          </div>
        `,
      });
    } catch (e) {
      console.error("Failed to send feedback email:", e);
    }
  }

  revalidatePath("/dashboard/feedback");
  return { success: true };
}
