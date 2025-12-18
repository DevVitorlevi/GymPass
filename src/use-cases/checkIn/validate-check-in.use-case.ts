import type { CheckInsRepository } from "@src/repositories/check-ins-repository.interface.js";
import type { CheckIn } from "generated/prisma/index.js";
import { ResourceNotFoundError } from "../erros/resource-not-found.error.js";

interface ValidadateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidadateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidadateCheckInUseCase {
  constructor(
    private checkinsRepository: CheckInsRepository,
  ) { }

  async execute({
    checkInId
  }: ValidadateCheckInUseCaseRequest): Promise<ValidadateCheckInUseCaseResponse> {
    const checkIn = await this.checkinsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validaded_at = new Date()

    await this.checkinsRepository.save(checkIn)
    return { checkIn }
  }
}
