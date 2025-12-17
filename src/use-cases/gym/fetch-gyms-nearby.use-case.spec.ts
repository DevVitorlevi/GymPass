import { InMemoryGymRepository } from '@src/repositories/in-memory/in-memory-gyms-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchGymsNearbyUseCase } from './fetch-gyms-nearby.use-case.js'


let gymsRepository: InMemoryGymRepository
let sut: FetchGymsNearbyUseCase

// Unit tests cannot be integration tests. No Database interation
describe('Fetch Gyms Nearby Use Case', () => {

  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new FetchGymsNearbyUseCase(gymsRepository)
  })

  it('should be to able search gyms nearby', async () => {

    await gymsRepository.create({
      title: "Academia Peroba",
      description: "Academia la de Peroba",
      phone: "(88)99999-9999",
      latitude: -4.7067794,
      longitude: -37.382672

    })

    await gymsRepository.create({
      title: "Academia Redonda",
      description: "Academia la de Redonda",
      phone: "(88)99999-9999",
      latitude: -4.7607794,
      longitude: -37.302672

    })

    await gymsRepository.create({
      title: "Academia  Vila Nova",
      description: "Academia la de Vila Nova",
      phone: "(88)99999-9999",
      latitude: -4.6257794,
      longitude: -37.382672

    })

    const { gyms } = await sut.execute({
      userlatitude: -4.7607794,
      userlongitude: - 37.382672,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Academia Peroba" }),
      expect.objectContaining({ title: "Academia Redonda" })
    ])
  })

})