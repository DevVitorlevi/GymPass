import type { Gym } from "generated/prisma/index.js";
import type { GymsRepository } from "../gyms-repository.interface.js";

export class InMemoryGymRepository implements GymsRepository {
  public database: Gym[] = []
  async findById(gymID: string) {
    const gym = this.database.find(gym => gym.id === gymID)

    if (!gym) {
      return null
    }

    return gym
  }

}