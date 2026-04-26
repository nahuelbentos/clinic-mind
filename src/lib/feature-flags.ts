import { prisma } from "./prisma";

export async function isFeatureEnabled(
  key: string,
  userId?: string
): Promise<boolean> {
  if (userId) {
    const perUserFlag = await prisma.featureFlag.findFirst({
      where: { key, userId, scope: "PER_USER" },
    });
    if (perUserFlag !== null) return perUserFlag.enabled;
  }

  const globalFlag = await prisma.featureFlag.findFirst({
    where: { key, scope: "GLOBAL" },
  });
  return globalFlag?.enabled ?? false;
}
