import { PrismaGymsRepository } from "@src/repositories/prisma/prisma-gyms-repository.js";
import { GymUseCase } from "../gym/create-gym.use-case.js";
export function makeGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const gymUseCase = new GymUseCase(gymsRepository)

  return gymUseCase
}