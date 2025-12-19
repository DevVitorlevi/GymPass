
import { makeGetGymByTitleUseCase } from "@src/use-cases/factories/make-get-gym-by-title.use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {

  const searchGymQueryParams = z.object({
    title: z.string(),
    page: z.coerce.number().min(1).default(1),
  })


  const { title, page } = searchGymQueryParams.parse(request.body)


  const gymUseCase = makeGetGymByTitleUseCase()
  const { gyms } = await gymUseCase.execute({ title, page })

  return reply.status(200).send({
    gyms,
  })

}