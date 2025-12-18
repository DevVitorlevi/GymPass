import { prisma } from "@src/lib/prisma.js";
import dayjs from "dayjs";
import type { CheckIn, Prisma } from "generated/prisma/index.js";
import type { CheckInsRepository } from "../check-ins-repository.interface.js";


export class PrismaCheckInsRepository implements CheckInsRepository {
  async findCheckInByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfDay = dayjs(date).startOf("day")
    const endOfDay = dayjs(date).endOf("day")

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        create_at: {
          gte: startOfDay.toDate(),
          lte: endOfDay.toDate(),
        },
      },
    });

    return checkIn;
  }

  async findManyCheckInsByUserId(
    userId: string,
    page: number
  ) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIns;
  }

  async findByUserMetrics(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });

    return count;
  }

  async findById(checkInId: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id: checkInId,
      },
    });

    return checkIn;
  }

  async create(
    data: Prisma.CheckInUncheckedCreateInput
  ): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data,
    });

    return checkIn;
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    });

    return checkIn;
  }
}
