import { InMemoryGymRepository } from '@src/repositories/in-memory/in-memory-gyms-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { GymUseCase } from './create-gym.use-case.js'


let gymsRepository: InMemoryGymRepository
let sut: GymUseCase

// Unit tests cannot be integration tests. No Database interation
describe('Gym Use Case', () => {

  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new GymUseCase(gymsRepository)
  })

  it('should be able to create Gym', async () => {
    const { gym } = await sut.execute({
      title: "Academia Peroba",
      description: "Academia la de Peroba",
      phone: "(88)99999-9999",
      latitude: -4.7607794,
      longitude: - 37.382672,

    })

    expect(gym.id).toEqual(expect.any(String))
  })

})