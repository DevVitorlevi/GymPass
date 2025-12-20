
import { makeFetchUserCheckInsHistoryUseCase } from "@src/use-cases/factories/make-fetch-user-check-ins-history.use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function history(request: FastifyRequest, reply: FastifyReply) {

  const historyCheckInsQueryParams = z.object({
    page: z.coerce.number().min(1).default(1),
  })


  const { page } = historyCheckInsQueryParams.parse(request.query)


  const fetchUserCheckInsHistoryUseCaseUseCase = makeFetchUserCheckInsHistoryUseCase()
  const { checkIns } = await fetchUserCheckInsHistoryUseCaseUseCase.execute({ userId: request.user.sub, page })

  return reply.status(200).send({
    checkIns,
  })

}