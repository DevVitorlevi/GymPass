import type { CheckIn, Prisma } from "generated/prisma/index.js";
import { randomUUID } from "node:crypto";
import type { CheckInsRepository } from "../check-ins-repository.interface.js";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public database: CheckIn[] = []
  async create(data: Prisma.CheckInUncheckedCreateInput) {

    const checkIn = {
      id: randomUUID(),
      validaded_at: data.validaded_at ? new Date(data.validaded_at) : null,
      gym_id: data.gym_id,
      user_id: data.user_id,
      create_at: new Date()
    }

    this.database.push(checkIn)

    return checkIn
  }
}