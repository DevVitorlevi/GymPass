import { PrismaUsersRepository } from "@src/repositories/prisma/prisma-users-repository.js";
import { LoginUseCase } from "@src/use-cases/auth/login.use-case.js";
import { InvalidCredentialsError } from "@src/use-cases/erros/invalid-credentials.error.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function login(request: FastifyRequest, reply: FastifyReply) {

  const loginBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6)
  })

  const { email, password } = loginBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const loginUseCase = new LoginUseCase(prismaUsersRepository)

    const user = await loginUseCase.execute({
      email,
      password
    })

  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send(
        error.message
      )
    }
    throw error
  }

  return reply.status(200).send({
    message: 'Auth User Sucessful'
  })
}