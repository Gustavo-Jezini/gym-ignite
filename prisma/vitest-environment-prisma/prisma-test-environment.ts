import { Environment } from 'vitest'

// Aqui é criado um ambiente isolado para o teste E2E
export default <Environment>{
  name: 'prisma',
  // Essa função roda antes de cada ARQUIVO de teste
  async setup() {
    console.log('Executou')

    return {
      // Isso roda ao final de todos os testes do ARQUIVO
      teardown() {},
    }
  },
}
