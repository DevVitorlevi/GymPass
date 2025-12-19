import { InMemoryCheckInsRepository } from "@src/repositories/in-memory/in-memory-check-ins-repository.js"
import { InMemoryGymRepository } from "@src/repositories/in-memory/in-memory-gyms-repository.js"
import { Decimal } from "generated/prisma/runtime/library.js"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { MaxDistanceError } from "@src/use-cases/erros/max-distance.error.js"
import { MaxNumberOfCheckInsError } from "@src/use-cases/erros/max-number-of-check-Ins.error.js"
import { CheckInUseCase } from "./check-in.use.case.js"

let checkinsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe("Check In Use Case", () => {
  beforeEach(async () => {
    checkinsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkinsRepository, gymsRepository)

    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    const gym = await gymsRepository.create({
      id: "gym-1",
      title: "Spotify Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-4.8680988),
      longitude: new Decimal(-37.659518),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to create check in", async () => {
    const { checkIn } = await sut.execute({
      gymID: "gym-1",
      userID: "user-1",
      userLatitude: -4.8681,
      userLongitude: -37.6595,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check in twice in same day", async () => {
    await sut.execute({
      gymID: "gym-1",
      userID: "user-1",
      userLatitude: -4.8681,
      userLongitude: -37.6595,
    })

    await expect(
      sut.execute({
        gymID: "gym-1",
        userID: "user-1",
        userLatitude: -4.8681,
        userLongitude: -37.6595,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it("should be able to check in twice in different days", async () => {
    await sut.execute({
      gymID: "gym-1",
      userID: "user-1",
      userLatitude: -4.8681,
      userLongitude: -37.6595,
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymID: "gym-1",
      userID: "user-1",
      userLatitude: -4.8681,
      userLongitude: -37.6595,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to create check in on distant gym", async () => {
    await expect(
      sut.execute({
        gymID: "gym-1",
        userID: "user-1",
        userLatitude: -4.9827226,
        userLongitude: -37.7866601,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
