import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max_distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-id',
      description: '',
      phone: '',
      title: '',
      latitude: -22.8196352,
      longitude: -47.087616,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -22.8196352,
      userLongitude: -47.087616,
    })

    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.gym_id).toEqual('gym-id')
    expect(checkIn.user_id).toEqual('user-id')
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 3, 2, 1, 21, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -22.8196352,
      userLongitude: -47.087616,
    })

    // console.log(checkIn.created_At)

    await expect(() =>
      sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
        userLatitude: -22.8196352,
        userLongitude: -47.087616,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2023, 3, 2, 1, 21, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -22.8196352,
      userLongitude: -47.087616,
    })

    vi.setSystemTime(new Date(2023, 3, 4, 1, 21, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -22.8196352,
      userLongitude: -47.087616,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distante gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      description: '',
      phone: '',
      title: '',
      latitude: new Decimal(-22.834033),
      longitude: new Decimal(-47.0459881),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-id',
        userLatitude: -22.8196352,
        userLongitude: -47.087616,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
