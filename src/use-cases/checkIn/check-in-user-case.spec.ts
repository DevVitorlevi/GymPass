import { InMemoryCheckInsRepository } from "@src/repositories/in-memory/in-memory-check-ins-repository.js";
import { InMemoryGymRepository } from "@src/repositories/in-memory/in-memory-gyms-repository.js";
import { Decimal } from "generated/prisma/runtime/library.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in.use.case.js";

let checkinsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase;

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkinsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkinsRepository, gymsRepository);

    // Mock da data para um valor fixo
    vi.useFakeTimers();

    gymsRepository.database.push({
      id: "gym-1",
      title: "Spotify Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-5.20476,),
      longitude: new Decimal(-37.3056037)
    })
  });

  afterEach(() => {
    // Restaura os timers reais após cada teste
    vi.useRealTimers();
  });

  it("should be able to create check in", async () => {
    const { checkIn } = await sut.execute({
      gymID: "gym-1",
      userID: "user-1",
      userLatitude: -5.2048,
      userLongitude: -37.3056

    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in same day", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymID: "gym-1",
      userID: "user-1",
      userLatitude: -5.2048,
      userLongitude: -37.3056

    });

    await expect(
      sut.execute({
        gymID: "gym-1",
        userID: "user-1",
        userLatitude: 0,
        userLongitude: 0

      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymID: "gym-1",
      userID: "user-1",
      userLatitude: -5.2048,
      userLongitude: -37.3056


    });

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymID: "gym-1",
      userID: "user-1",
      userLatitude: -5.2048,
      userLongitude: -37.3056

    });

    expect(checkIn.id).toEqual(expect.any(String));
  });


  it("should bot be able to create check in on distace gym", async () => {

    gymsRepository.database.push({
      id: "gym-1",
      title: "Spotify Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-4.6988146),
      longitude: new Decimal(-37.3813776)
    })

    await expect(
      sut.execute({
        gymID: "gym-1",
        userID: "user-1",
        userLatitude: -4.9827226,
        userLongitude: -37.7866601
      })
    ).rejects.toBeInstanceOf(Error)

  });

});