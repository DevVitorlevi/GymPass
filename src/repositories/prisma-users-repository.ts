import { prisma } from '@src/lib/prisma.js'
import { Prisma } from 'generated/prisma/index.js'

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data
    })
    return user
  }
}