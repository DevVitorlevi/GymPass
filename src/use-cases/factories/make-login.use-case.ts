import { PrismaUsersRepository } from "@src/repositories/prisma/prisma-users-repository.js"
import { LoginUseCase } from "../auth/login.use-case.js"

export function makeLoginUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const loginUseCase = new LoginUseCase(prismaUsersRepository)

  return loginUseCase
}