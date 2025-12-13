import type { UsersRepository } from "@src/repositories/users-repository.interface.js";
import { compare } from "bcryptjs";
import type { User } from "generated/prisma/index.js";
import { InvalidCredentialsError } from "../erros/invalid-credentials.error.js";

interface LoginUseCaseRequest {
  email: string,
  password: string
}
interface LoginUseCaseResponse {
  user: User
}

export class LoginUseCase {
  constructor(private usersRepository: UsersRepository) {
  }

  async execute({ email, password }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const user = await this.usersRepository.findEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMarches = await compare(password, user.password_hash)

    if (!doesPasswordMarches) {
      throw new InvalidCredentialsError()
    }

    return {
      user
    }
  }
}