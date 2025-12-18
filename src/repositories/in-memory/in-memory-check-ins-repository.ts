import dayjs from "dayjs";
import type { CheckIn, Prisma } from "generated/prisma/index.js";
import { randomUUID } from "node:crypto";
import type { CheckInsRepository } from "../check-ins-repository.interface.js";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public database: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      validaded_at: data.validaded_at ? new Date(data.validaded_at) : null,
      gym_id: data.gym_id,
      user_id: data.user_id,
      create_at: new Date()
    };

    this.database.push(checkIn);

    return checkIn;
  }

  async findCheckInByUserIdOnDate(user_id: string, date: Date) {
    const checkIn = this.database.find(checkIn => {
      const isSameDay = dayjs(checkIn.create_at).isSame(date, 'date');

      return checkIn.user_id === user_id && isSameDay;
    });

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }
  async findManyCheckInsByUserId(userId: string, page: number) {
    return this.database.filter(checkIns => checkIns.user_id === userId).slice((page - 1) * 20, page * 20)
  }
  async findByUserMetrics(userId: string) {
    return this.database.filter(checkIns => checkIns.user_id === userId).length
  }

  async findById(id: string) {
    const checkIn = await this.database.find(checkIn => checkIn.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = await this.database.findIndex(item => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.database[checkInIndex] === checkIn
    }

    return checkIn
  }
}