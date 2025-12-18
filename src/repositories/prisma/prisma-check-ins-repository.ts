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
  async findByUserMetrics(userId: string) {
    const count = prisma.checkIn.count({
      where: {
        user_id: userId
      }
    })

    return count
  }

  async save(data: CheckIn): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id
      },
      data: data
    })
    return checkIn
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