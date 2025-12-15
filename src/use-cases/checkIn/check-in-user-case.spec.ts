import { InMemoryCheckInsRepository } from "@src/repositories/in-memory/in-memory-check-in-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { CheckInUseCase } from "./check-in.user.case.js";

let checkinsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkinsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkinsRepository)
  })

  it("should be able to create check in", async () => {
    const { checkIn } = await sut.execute({
      gymID: "gym-id",
      userID: "user-id"
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})