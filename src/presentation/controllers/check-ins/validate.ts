
import { makeValidadateCheckInUseCase } from "@src/use-cases/factories/make-validate-check-in.use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function validate(request: FastifyRequest, reply: FastifyReply) {

  const validateCheckInParamsSchema = z.object({
    checkInId: z.string()
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validadateCheckInUseCase = makeValidadateCheckInUseCase()
  const checkIn = await validadateCheckInUseCase.execute({
    checkInId
  })

  return reply.status(204).send({
    message: "Validado",
  })

}