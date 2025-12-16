import { InMemoryCheckInsRepository } from "@src/repositories/in-memory/in-memory-check-in-repository.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in.use.case.js";

let checkinsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkinsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkinsRepository);

    // Mock da data para um valor fixo
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restaura os timers reais após cada teste
    vi.useRealTimers();
  });

  it("should be able to create check in", async () => {
    const { checkIn } = await sut.execute({
      gymID: "gym-id",
      userID: "user-id"
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in same day", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymID: 'gym-1',
      userID: 'user-1'
    });

    await expect(
      sut.execute({
        gymID: 'gym-1',
        userID: 'user-1'
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymID: 'gym-1',
      userID: 'user-1'
    });

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymID: 'gym-1',
      userID: 'user-1'
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});