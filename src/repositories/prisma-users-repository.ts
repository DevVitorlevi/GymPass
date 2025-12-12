import { prisma } from '@src/lib/prisma.js'
import { Prisma, type User } from 'generated/prisma/index.js'
import type { UsersRepository } from './users-repository.interface.js'

export class PrismaUsersRepository implements UsersRepository {
  async findEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    return user
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data
    })

    return user
  }
}