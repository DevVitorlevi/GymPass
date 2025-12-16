import type { CheckInsRepository } from "@src/repositories/check-ins-repository.interface.js";
import type { GymsRepository } from "@src/repositories/gyms-repository.interface.js";
import type { CheckIn } from "generated/prisma/index.js";
import { InvalidCredentialsError } from "../erros/invalid-credentials.error.js";

interface CheckInUseCaseRequest {
  userID: string,
  gymID: string,
  userLatitude: number,
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkinsRepository: CheckInsRepository, private gymsRepository: GymsRepository) { }

  async execute({
    userID,
    gymID,
    userLatitude,
    userLongitude
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymID)

    if (!gym) {
      throw new InvalidCredentialsError()
    }

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