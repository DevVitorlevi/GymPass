import type { CheckInsRepository } from "@src/repositories/check-ins-repository.interface.js";
import type { CheckIn } from "generated/prisma/index.js";

interface GetUserMetricsUseCaseRequest {
  userId: string,
}

interface GetUserMetricsUseCaseResponse {
  countCheckin: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({ userId }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const countCheckin = await this.checkInsRepository.findByUserMetrics(userId)

    return { countCheckin }
  }
}