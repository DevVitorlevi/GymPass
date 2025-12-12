import { prisma } from "@src/lib/prisma.js"
import type { UsersRepository } from "@src/repositories/users-repository.interface.js"
import { hash } from "bcryptjs"
import { UserAlreadyExistError } from "../erros/user-already-exist.error.js"

interface RegisterDTO {
  name: string,
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) { }

  async execute({ name, email, password }: RegisterDTO) {

    const password_hash = await hash(password, 6)
    const userWithSameEmail = await this.userRepository.findEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistError()
    }

    await this.userRepository.create({
      name,
      email,
      password_hash
    })
  }

}
