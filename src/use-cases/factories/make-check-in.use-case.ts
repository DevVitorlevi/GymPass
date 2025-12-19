import { PrismaCheckInsRepository } from "@src/repositories/prisma/prisma-check-ins-repository.js";
import { PrismaGymsRepository } from "@src/repositories/prisma/prisma-gyms-repository.js";
import { CheckInUseCase } from "@src/use-cases/check-in.use.case.js";
export function makeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository)

  return checkInUseCase
}