
import { UserAlreadyExistError } from "@src/use-cases/erros/user-already-exist.error.js";
import { makeRegisterUseCase } from "@src/use-cases/factories/make-register.use-case.js";
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
    const registerUseCase = makeRegisterUseCase()
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