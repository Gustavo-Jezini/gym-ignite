import 'dotenv/config'
import { randomUUID } from 'crypto'
import { Environment } from 'vitest'
import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// "postgresql://docker:docker@localhost:5432/apisolid?schema=public" -> a função altera o valor de schema

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

// Aqui é criado um ambiente isolado para o teste E2E
export default <Environment>{
  name: 'prisma',
  // Essa função roda antes de cada ARQUIVO de teste
  async setup() {
    const schema = randomUUID()
    const databaseurl = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseurl

    execSync('npx prisma migrate deploy')

    return {
      // Isso roda ao final de todos os testes do ARQUIVO
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
