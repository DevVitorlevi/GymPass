import type { CheckIn, Prisma } from "generated/prisma/index.js";

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findCheckInByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyCheckInsByUserId(userId: string, page: number): Promise<CheckIn[]>
  findByUserMetrics(userId: string): Promise<number>
}