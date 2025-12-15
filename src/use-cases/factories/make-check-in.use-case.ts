import { PrismaCheckInsRepository } from "@src/repositories/prisma/prisma-checkIn-repository.js";
import { CheckInUseCase } from "../checkIn/check-in.user.case.js";

export function makeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const checkInUseCase = new CheckInUseCase(checkInRepository)

  return checkInUseCase
}