
import { makeFetchGymsNearbyUseCase } from "@src/use-cases/factories/make-fetch-gyms-nearby.use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {

  const nearbyGymsQueryParams = z.object({
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180
    })
  })


  const { latitude, longitude } = nearbyGymsQueryParams.parse(request.query)


  const gymUseCase = makeFetchGymsNearbyUseCase()
  const { gyms } = await gymUseCase.execute({ userlatitude: latitude, userlongitude: longitude })

  return reply.status(200).send({
    gyms,
  })

}