import type { CheckInsRepository } from "@src/repositories/check-ins-repository.interface.js";
import type { GymsRepository } from "@src/repositories/gyms-repository.interface.js";
import { getDistanceBetweenCoordinates } from "@src/utils/get-distance-between-coordinate.js";
import type { CheckIn } from "generated/prisma/index.js";
import { MaxDistanceError } from "../erros/max-distance.error.js";
import { ResourceNotFoundError } from "../erros/resource-not-found.error.js";
import { MaxNumberOfCheckInsError } from "../erros/max-number-of-check-Ins.error.js";

interface CheckInUseCaseRequest {
  userID: string
  gymID: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkinsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) { }

  async execute({
    userID,
    gymID,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

    const gym = await this.gymsRepository.findById(gymID)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDay =
      await this.checkinsRepository.findCheckInByUserIdOnDate(
        userID,
        new Date()
      )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    )

    const MAX_CHECK_IN_DISTANCE_KM = 0.1

    if (distance > MAX_CHECK_IN_DISTANCE_KM) {
      throw new MaxDistanceError()
    }

    const checkIn = await this.checkinsRepository.create({
      gym_id: gymID,
      user_id: userID,
    })

    return { checkIn }
  }
}
