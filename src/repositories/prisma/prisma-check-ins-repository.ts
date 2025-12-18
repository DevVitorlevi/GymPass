import { prisma } from "@src/lib/prisma.js";
import type { CheckIn, Prisma } from "generated/prisma/index.js";
import type { CheckInsRepository } from "../check-ins-repository.interface.js";

export class PrismaCheckInsRepository implements CheckInsRepository {

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data
    })
    return checkIn
  }
}