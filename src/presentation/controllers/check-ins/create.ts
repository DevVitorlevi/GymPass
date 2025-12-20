
import { makeCheckInUseCase } from "@src/use-cases/factories/make-check-in.use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {

  const createCheckInParamsSchema = z.object({
    gymId: z.string()
  })
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180
    })
  })

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)
  const { gymId } = createCheckInParamsSchema.parse(request.params)

  const checkInUseCase = makeCheckInUseCase()
  const checkIn = await checkInUseCase.execute({
    gymID: gymId,
    userID: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send({
    message: "Created CheckIn sucessful",
  })

}