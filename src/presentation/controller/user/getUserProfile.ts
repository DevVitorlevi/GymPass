
import { InvalidCredentialsError } from "@src/use-cases/erros/invalid-credentials.error.js";
import { makeGetUserUseCase } from "@src/use-cases/factories/make-get-user-profile.use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
export interface GetUserParams {
  id: string
}
export async function getUserProfile(
  request: FastifyRequest<{ Params: GetUserParams }>,
  reply: FastifyReply
) {
  const { id } = request.params

  try {
    const getUserUseCase = makeGetUserUseCase()

    const { user } = await getUserUseCase.execute({
      userID: id,
    })

    return reply.status(200).send(user)

  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: error.message,
      })
    }
    throw error
  }
}