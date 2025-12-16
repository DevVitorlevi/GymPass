import type { CheckInsRepository } from "@src/repositories/check-ins-repository.interface.js";
import type { CheckIn } from "generated/prisma/index.js";

interface CheckInUseCaseRequest {
  userID: string,
  gymID: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkinsRepository: CheckInsRepository) { }

  async execute({
    userID,
    gymID
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

    const checkInOnSameDay = await this.checkinsRepository.findCheckInByUserIdOnDate(
      userID,
      new Date()
    )

    if (checkInOnSameDay) {
      throw new Error('User already checked in today');
    }

    const checkIn = await this.checkinsRepository.create({
      gym_id: gymID,
      user_id: userID
    })


    return { checkIn }
  }
}