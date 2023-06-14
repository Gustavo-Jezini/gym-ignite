import { UsersRepository } from '../repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface GetUserProfileteUseCaseRequest {
  userId: string
}

interface GetUserProfileteUseCaseResponse {
  user: User
}

export class GetUserProfileteUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileteUseCaseRequest): Promise<GetUserProfileteUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
