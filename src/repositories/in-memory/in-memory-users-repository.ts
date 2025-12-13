import type { Prisma, User } from "generated/prisma/index.js";
import type { UsersRepository } from "../users-repository.interface.js";

export class InMemoryUsersRepository implements UsersRepository {
  public database: User[] = []
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: "user-1",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      create_at: new Date()
    }

    this.database.push(user)

    return user
  }
  async findEmail(email: string) {
    const user = this.database.find(user => user.email === email)

    if (!user) {
      return null
    }
    return user
  }

}