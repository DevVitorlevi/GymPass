import { getDistanceBetweenCoordinates } from "@src/utils/get-distance-between-coordinate.js";
import { randomUUID } from "crypto";
import { Prisma, type Gym } from "generated/prisma/index.js";
import type { FindManyNearby, GymsRepository } from "../gyms-repository.interface.js";

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

  async findManyGym(title: string, page: number) {
    return this.database.filter(gyms => gyms.title.includes(title)).slice((page - 1) * 20, page * 20)
  }

  async findManyNearby(params: FindManyNearby) {
    return this.database.filter(gym => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
      )
      return distance < 10
    })
  }
}