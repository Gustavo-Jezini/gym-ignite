import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -22.8196352,
      longitude: -47.087616,
    })

    await gymsRepository.create({
      title: 'NodeJs Gym',
      description: null,
      phone: null,
      latitude: -22.8196352,
      longitude: -47.087616,
    })

    const { gyms } = await sut.execute({ page: 1, query: 'NodeJs Gym' })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'NodeJs Gym' })])
  })

  it('should be able to fetch paginate gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `NodeJs Gym ${i}`,
        description: null,
        phone: null,
        latitude: -22.8196352,
        longitude: -47.087616,
      })
    }

    const { gyms } = await sut.execute({ page: 2, query: 'NodeJs Gym' })

    expect(gyms).toHaveLength(2)

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'NodeJs Gym 21' }),
      expect.objectContaining({ title: 'NodeJs Gym 22' }),
    ])
  })
})
