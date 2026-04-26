export const PLAN_LIMITS: Record<string, { maxPatients: number }> = {
  FREE: { maxPatients: 5 },
  PRO: { maxPatients: Infinity },
  PREMIUM: { maxPatients: Infinity },
};
