import { PrismaCheckInsRepository } from "@src/repositories/prisma/prisma-check-ins-repository.js";
import { ValidadateCheckInUseCase } from "../checkIn/validate-check-in.use-case.js";
export function makeValidadateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const validadateCheckInUseCase = new ValidadateCheckInUseCase(checkInsRepository)

  return validadateCheckInUseCase
}