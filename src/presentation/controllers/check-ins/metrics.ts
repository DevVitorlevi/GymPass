
import { makeGetUserMetricsUseCase } from "@src/use-cases/factories/make-get-user-metrics.use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase()
  const { countCheckin } = await getUserMetricsUseCase.execute({ userId: request.user.sub })

  return reply.status(200).send({
    countCheckin,
  })

}