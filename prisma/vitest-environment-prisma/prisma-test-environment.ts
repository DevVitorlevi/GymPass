import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não definida')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

const environment: Environment = {
  name: 'prisma',
  transformMode: 'ssr',

  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    // Salva a URL original
    const originalDatabaseUrl = process.env.DATABASE_URL
    process.env.DATABASE_URL = databaseUrl

    // cria o schema isolado
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl }
    })

    return {
      async teardown() {
        try {
          // Usa o cliente pg diretamente para dropar o schema
          const { default: pg } = await import('pg')
          const { Client } = pg

          const client = new Client({
            connectionString: process.env.DATABASE_URL,
          })

          await client.connect()
          await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
          await client.end()
        } catch (error) {
          console.error('Erro ao limpar o schema de teste:', error)
        } finally {
          // Restaura a URL original
          process.env.DATABASE_URL = originalDatabaseUrl
        }
      },
    }
  },
}

export default environment