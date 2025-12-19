import type { UsersRepository } from "@src/repositories/users-repository.interface.js";
import type { User } from "generated/prisma/index.js";
import { InvalidCredentialsError } from "./erros/invalid-credentials.error.js";

interface GetUserProfileUseCaseRequest {
  userID: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ userID }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userID)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}