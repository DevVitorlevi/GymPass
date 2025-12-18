import { makeGetUserUseCase } from "@src/use-cases/factories/make-get-user-profile.use-case.js"
import type { FastifyReply, FastifyRequest } from "fastify"

export async function profile(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const getUserProfile = makeGetUserUseCase()

  const { user } = await getUserProfile.execute({
    userID: request.user.sub
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined
    }
  })

}