import type { GymsRepository } from "@src/repositories/gyms-repository.interface.js"
import type { Gym } from "generated/prisma/index.js"

interface GetGymByTitleUseCaseRequest {
  title: string,
  page: number
}

interface GetGymByTitleUseCaseResponse {
  gyms: Gym[]
}

export class GetGymByTitleUseCase {
  constructor(private gymsRepository: GymsRepository) { }

  async execute({ title, page }: GetGymByTitleUseCaseRequest): Promise<GetGymByTitleUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyGym(title, page)

    return { gyms }
  }

}
