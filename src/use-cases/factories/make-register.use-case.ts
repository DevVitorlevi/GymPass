import { PrismaUsersRepository } from "@src/repositories/prisma/prisma-users-repository.js"
import { RegisterUseCase } from "../register.use-case.js"

export function makeRegisterUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(prismaUsersRepository)

  return registerUseCase
}