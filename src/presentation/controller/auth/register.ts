import { PrismaUsersRepository } from "@src/repositories/prisma/prisma-users-repository.js";
import { RegisterUseCase } from "@src/use-cases/auth/register.use-case.js";
import { UserAlreadyExistError } from "@src/use-cases/erros/user-already-exist.error.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";


export async function register(request: FastifyRequest, reply: FastifyReply) {

  const resgisterBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6)
  })

  const { name, email, password } = resgisterBodySchema.parse(request.body)


  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    const user = await registerUseCase.execute({ name, email, password })

  } catch (error) {
    if (error instanceof UserAlreadyExistError) {
      return reply.status(409).send({
        mensage: error.message
      })
    }
    throw error
  }

  return reply.status(201).send({
    message: "Created User sucessful"
  })
}