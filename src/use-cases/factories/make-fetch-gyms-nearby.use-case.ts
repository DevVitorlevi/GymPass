import { PrismaGymsRepository } from "@src/repositories/prisma/prisma-gyms-repository.js";
import { FetchGymsNearbyUseCase } from "../gym/fetch-gyms-nearby.use-case.js";
export function makeFetchGymsNearbyUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const fetchGymsNearbyUseCase = new FetchGymsNearbyUseCase(gymsRepository)

  return fetchGymsNearbyUseCase
}