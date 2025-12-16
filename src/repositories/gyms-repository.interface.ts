import type { Gym } from "generated/prisma/index.js";

export interface GymsRepository {
  findById(userID: string): Promise<Gym | null>
}