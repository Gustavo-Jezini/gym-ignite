import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
// import { prisma } from '@/lib/prisma'
// import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
// Agora, a instancia será passada pelo construtor

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// SOLID -> D === Inversão de dependencia

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // const prismaUsersRepository = new PrismaUsersRepository()

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
