import type { GymsRepository } from "@src/repositories/gyms-repository.interface.js"
import type { Gym } from "generated/prisma/index.js"

interface FetchGymsNearbyUseCaseRequest {
  userlatitude: number,
  userlongitude: number
}

interface FetchGymsNearbyUseCaseResponse {
  gyms: Gym[]
}

export class FetchGymsNearbyUseCase {
  constructor(private gymsRepository: GymsRepository) { }

  async execute({ userlatitude, userlongitude }: FetchGymsNearbyUseCaseRequest): Promise<FetchGymsNearbyUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userlatitude,
      longitude: userlongitude
    })

    return { gyms }
  }

}
