import { prisma } from "./prisma";

export function getDb(_userId: string) {
  // Today returns shared client filtered by userId
  // In the future, can return a tenant-specific client
  return prisma;
}
