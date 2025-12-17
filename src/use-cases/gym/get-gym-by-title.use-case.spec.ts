import { InMemoryGymRepository } from '@src/repositories/in-memory/in-memory-gyms-repository.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetGymByTitleUseCase } from './get-gym-by-title.use-case.js'


let gymsRepository: InMemoryGymRepository
let sut: GetGymByTitleUseCase

// Unit tests cannot be integration tests. No Database interation
describe('Get Gym By Title Use Case', () => {

  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new GetGymByTitleUseCase(gymsRepository)
  })

  it('should be to able search gym by title', async () => {

    await gymsRepository.create({
      title: "Academia Peroba",
      description: "Academia la de Peroba",
      phone: "(88)99999-9999",
      latitude: -4.7607794,
      longitude: - 37.382672,
    })

    await gymsRepository.create({
      title: "Academia  Redonda",
      description: "Academia la de Redonda",
      phone: "(88)99999-9999",
      latitude: -4.7607794,
      longitude: - 37.382672,
    })

    const { gyms } = await sut.execute({
      title: "Academia Peroba",
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Academia Peroba" }),
    ])
  })

  it('should be to able search paginated gym by title', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Academia Peroba - ${i}`,
        description: "Academia la de Peroba",
        phone: "(88)99999-9999",
        latitude: -4.7607794,
        longitude: - 37.382672,
      })
    }

    const { gyms } = await sut.execute({
      title: "Academia Peroba",
      page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Academia Peroba - 21" }),
      expect.objectContaining({ title: "Academia Peroba - 22" }),
    ])
  })
})