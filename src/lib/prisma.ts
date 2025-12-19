import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../../generated/prisma/client.js'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

// Variável que pode ser sobrescrita nos testes
let prismaInstance: PrismaClient | null = null

function createPrismaInstance() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
  })
}

// Getter que permite sobrescrever a instância
export const getPrisma = () => {
  if (!prismaInstance) {
    prismaInstance = createPrismaInstance()
  }
  return prismaInstance
}

// Função para sobrescrever o prisma (usada apenas nos testes)
export const setPrisma = (newPrisma: PrismaClient) => {
  prismaInstance = newPrisma
}

// Export padrão para compatibilidade
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return (getPrisma() as any)[prop]
  }
})