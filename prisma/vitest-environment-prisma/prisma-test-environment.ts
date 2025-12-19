import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'
import { prisma } from '../../src/lib/prisma'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não definida')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)
    process.env.DATABASE_URL = databaseUrl

    // cria o schema isolado
    execSync('npx prisma db push', { stdio: 'inherit' })

    return {
      async teardown() {
        // dropa o schema
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await prisma.$disconnect()
      },
    }
  },
}
