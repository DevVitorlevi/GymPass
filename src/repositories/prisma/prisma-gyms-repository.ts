import { prisma } from "@src/lib/prisma.js";
import type { Gym, Prisma } from "generated/prisma/index.js";
import type { FindManyNearby, GymsRepository } from "../gyms-repository.interface.js";

export class PrismaGymsRepository implements GymsRepository {

  async findById(gymId: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id: gymId
      }
    })
    return gym
  }
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data })
    return gym
  }
  async findManyGym(title: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: title
        }
      },
      take: 20,
      skip: (page - 1) * 20
    })
    return gyms
  }
  async findManyNearby(
    { latitude, longitude }: FindManyNearby
  ) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT *
      FROM gyms
      WHERE (
        6371 * acos(
          cos(radians(${latitude})) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(${longitude})) +
          sin(radians(${latitude})) *
          sin(radians(latitude))
        )
      ) <= 10
    `;

    return gyms;
  }
}