import type { Gym, Prisma } from "generated/prisma/index.js";

export interface FindManyNearby {
  latitude: number
  longitude: number
}
export interface GymsRepository {
  findById(userID: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findManyGym(title: string, page: number): Promise<Gym[]>
  findManyNearby(params: FindManyNearby): Promise<Gym[]>
}