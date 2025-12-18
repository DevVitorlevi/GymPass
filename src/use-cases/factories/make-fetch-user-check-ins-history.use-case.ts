import { PrismaCheckInsRepository } from "@src/repositories/prisma/prisma-check-ins-repository.js";
import { FetchUserCheckInsHistoryUseCase } from "../users/fetch-user-check-ins-history.use-case.js";
export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const getUserUseCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  return getUserUseCase
}