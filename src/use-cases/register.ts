import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
// import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
// Agora, a instancia será passada pelo construtor

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// SOLID -> D === Inversão de dependencia

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('E-mail already exists.')
    }

    // const prismaUsersRepository = new PrismaUsersRepository()

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
