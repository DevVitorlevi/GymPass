import { InMemoryCheckInsRepository } from "@src/repositories/in-memory/in-memory-check-ins-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-metrics.use.case.js";

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe("Get User Metrics Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it("should be able to return check ins count.", async () => {
    await checkInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1"
    })

    await checkInsRepository.create({
      gym_id: "gym-2",
      user_id: "user-1"
    })

    const { countCheckin } = await sut.execute({
      userId: "user-1",
    })

    expect(countCheckin).toEqual(2)
  })
})