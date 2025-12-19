import type { UsersRepository } from "@src/repositories/users-repository.interface.js"
import { hash } from "bcryptjs"
import type { User } from "generated/prisma/index.js"
import { UserAlreadyExistError } from "./erros/user-already-exist.error.js"

interface IRegisterUseCase {
  name: string,
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) { }

  async execute({ name, email, password }: IRegisterUseCase): Promise<RegisterUseCaseResponse> {

    const password_hash = await hash(password, 6)
    const userWithSameEmail = await this.userRepository.findEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistError()
    }

    const user = await this.userRepository.create({
      name,
      email,
      password_hash
    })

    return {
      user,
    }
  }

}
