import type { CheckInsRepository } from "@src/repositories/check-ins-repository.interface.js";
import { LateCheckInValidationError } from "@src/use-cases/erros/late-check-in-validation.error.js";
import { ResourceNotFoundError } from "@src/use-cases/erros/resource-not-found.error.js";
import dayjs from "dayjs";
import type { CheckIn } from "generated/prisma/index.js";

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

    const differenceBetweenDateAndCheckInCreation = dayjs(new Date()).diff(
      checkIn.create_at,
      'minutes'
    )

    if (differenceBetweenDateAndCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validaded_at = new Date()

    await this.checkinsRepository.save(checkIn)
    return { checkIn }
  }
}
