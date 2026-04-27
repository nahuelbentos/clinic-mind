import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  profession: z.string().optional(),
  licenseNumber: z.string().optional(),
});

export const patientSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  referredBy: z.string().optional(),
  emergencyContact: z.string().optional(),
  consultationReason: z.string().optional(),
  background: z.string().optional(),
  currentMedication: z.string().optional(),
  previousTherapy: z.string().optional(),
  actValues: z.string().optional(),
  // Social integration fields
  disabilityType: z
    .enum(["MOTOR", "COGNITIVE", "SENSORY", "MULTIPLE", "OTHER"])
    .optional()
    .or(z.literal("")),
  autonomyLevel: z.string().optional(),
  integrationContext: z.string().optional(),
});

export const sessionSchema = z.object({
  date: z.string().min(1, "La fecha es requerida"),
  duration: z.coerce.number().min(1, "Duración inválida").default(50),
  sessionNumber: z.coerce.number().min(1, "Número de sesión inválido"),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  notes: z.string().optional(),
  nextSessionGoal: z.string().optional(),
  paymentStatus: z.enum(["PAID", "PENDING", "EXEMPT"]),
  paymentAmount: z.coerce.number().optional(),
  meetLink: z.string().url("URL de reunión inválida").optional().or(z.literal("")),
  meetProvider: z.enum(["GOOGLE_MEET", "ZOOM", "TEAMS", "OTHER"]).optional(),
});

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Paciente requerido"),
  scheduledAt: z.string().min(1, "Fecha requerida"),
});

export const feedbackSchema = z.object({
  type: z.enum(["BUG", "FEATURE_REQUEST", "IMPROVEMENT", "OTHER"]),
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  currentBehavior: z.string().optional(),
  desiredBehavior: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  profession: z.string().optional(),
  licenseNumber: z.string().optional(),
});

export const goalSchema = z.object({
  description: z.string().min(3, "Mínimo 3 caracteres"),
  area: z.enum(["SOCIAL", "LABOR", "EDUCATIONAL", "FAMILY"]),
  targetDate: z.string().optional(),
  notes: z.string().optional(),
});

export const reportSchema = z.object({
  periodStart: z.string().min(1, "Fecha de inicio requerida"),
  periodEnd: z.string().min(1, "Fecha de fin requerida"),
  area: z.enum([
    "SOCIAL_INTEGRATION",
    "LABOR_INTEGRATION",
    "EDUCATIONAL_INTEGRATION",
    "FAMILY_INTEGRATION",
    "AUTONOMY",
  ]),
  progressScale: z.enum(["INITIAL", "IN_DEVELOPMENT", "ACHIEVED"]),
  observations: z.string().min(5, "Mínimo 5 caracteres"),
  recommendations: z.string().min(5, "Mínimo 5 caracteres"),
  nextObjectives: z.string().min(5, "Mínimo 5 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PatientInput = z.infer<typeof patientSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
