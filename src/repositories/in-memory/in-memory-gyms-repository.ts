import { randomUUID } from "crypto";
import { Prisma, type Gym } from "generated/prisma/index.js";
import type { GymsRepository } from "../gyms-repository.interface.js";

export class InMemoryGymRepository implements GymsRepository {
  public database: Gym[] = []
  async findById(gymID: string) {
    const gym = this.database.find(gym => gym.id === gymID)

    if (!gym) {
      return null
    }

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      create_at: new Date()
    }

    this.database.push(gym)

    return gym
  }

}