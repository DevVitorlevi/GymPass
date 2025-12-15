import { PrismaUsersRepository } from "@src/repositories/prisma/prisma-users-repository.js";
import { GetUserProfileUseCase } from "../users/get-user-proflie.use-case.js";

export function makeGetUserUseCase() {
  const userRepository = new PrismaUsersRepository()
  const getUserUseCase = new GetUserProfileUseCase(userRepository)

  return getUserUseCase
}