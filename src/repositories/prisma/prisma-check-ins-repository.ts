import { prisma } from "@src/lib/prisma.js";
import type { CheckIn, Prisma } from "generated/prisma/index.js";
import type { CheckInsRepository } from "../check-ins-repository.interface.js";

export class PrismaCheckInsRepository implements CheckInsRepository {
  findCheckInByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    throw new Error("Method not implemented.");
  }
  findManyCheckInsByUserId(userId: string, page: number): Promise<CheckIn[]> {
    throw new Error("Method not implemented.");
  }
  findByUserMetrics(userId: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  save(checkIn: CheckIn): Promise<CheckIn> {
    throw new Error("Method not implemented.");
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data
    })
    return checkIn
  }

  async findById(checkInId: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id: checkInId
      }
    })
    return checkIn
  }
}