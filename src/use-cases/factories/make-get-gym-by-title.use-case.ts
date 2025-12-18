import { PrismaGymsRepository } from "@src/repositories/prisma/prisma-gyms-repository.js";
import { GetGymByTitleUseCase } from "../gym/get-gym-by-title.use-case.js";
export function makeGetGymByTitleUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const getGymByTitleUsecase = new GetGymByTitleUseCase(gymsRepository)

  return getGymByTitleUsecase
}