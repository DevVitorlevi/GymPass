import { InMemoryCheckInsRepository } from "@src/repositories/in-memory/in-memory-check-ins-repository.js"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { LateCheckInValidationError } from "@src/use-cases/erros/late-check-in-validation.error.js"
import { ResourceNotFoundError } from "@src/use-cases/erros/resource-not-found.error.js"
import { ValidadateCheckInUseCase } from "./validate-check-in.use-case.js"

let checkinsRepository: InMemoryCheckInsRepository
let sut: ValidadateCheckInUseCase

describe("Validate Check In Use Case", () => {
  beforeEach(async () => {
    checkinsRepository = new InMemoryCheckInsRepository()
    sut = new ValidadateCheckInUseCase(checkinsRepository)

    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to validate check in", async () => {
    const createdCheckIn = await checkinsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1"
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validaded_at).toEqual(expect.any(Date))
    expect(checkinsRepository.database[0].validaded_at).toEqual(expect.any(Date))
  })

  it("should not be able to validate an inexistent check in", async () => {
    await expect(
      sut.execute({
        checkInId: "inexistent-check-in"
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to validate the check-in 20 minutes after created", async () => {
    const createdCheckIn = await checkinsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1"
    })
    vi.advanceTimersByTime(1000 * 60 * 21)

    await expect(
      sut.execute({
        checkInId: createdCheckIn.id
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
