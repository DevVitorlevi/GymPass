import type { CheckInsRepository } from "@src/repositories/check-ins-repository.interface.js";
import type { CheckIn } from "generated/prisma/index.js";

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string,
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({ userId, page }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyCheckInsByUserId(userId, page)

    return { checkIns }
  }
}