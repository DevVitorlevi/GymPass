import type { Prisma, User } from "generated/prisma/index.js";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findEmail(email: string): Promise<User | null>
  findById(userID: string): Promise<User | null>
}