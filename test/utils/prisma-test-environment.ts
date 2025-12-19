import { PrismaPg } from '@prisma/adapter-pg';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import { URL } from 'url';
import { PrismaClient } from '../../generated/prisma/client.js';
export class PrismaTestEnvironment {
  private schema: string;
  private databaseUrl: string;
  private originalDatabaseUrl: string;
  private pool: Pool | null = null;
  public prisma: any;

  constructor() {
    // Salva a URL original
    this.originalDatabaseUrl = process.env.DATABASE_URL || '';

    // Gera um UUID único para o schema (remove hífens para ser um nome válido)
    this.schema = `test_${randomUUID().replace(/-/g, '_')}`;

    // Obtém a URL base do banco de dados
    const baseUrl = process.env.DATABASE_URL;
    if (!baseUrl) {
      throw new Error('DATABASE_URL não está definida no .env.test');
    }

    // Parse da URL e adiciona o schema como parâmetro
    const url = new URL(baseUrl);
    url.searchParams.set('schema', this.schema);
    this.databaseUrl = url.toString();
  }

  async setup(): Promise<void> {
    try {
      console.log(`📦 Criando schema de teste: ${this.schema}`);

      // Define a URL com o schema isolado na variável de ambiente
      process.env.DATABASE_URL = this.databaseUrl;

      // Executa as migrations para criar o schema
      execSync('npx prisma migrate deploy', {
        env: {
          ...process.env,
          DATABASE_URL: this.databaseUrl,
        },
        stdio: 'pipe',
      });

      // Cria o Pool com a URL do schema isolado
      this.pool = new Pool({
        connectionString: this.databaseUrl,
      });

      // Cria o adapter
      const adapter = new PrismaPg(this.pool);

      // Importa dinamicamente o PrismaClient DEPOIS de configurar tudo
      const { PrismaClient } = await import('../../generated/prisma/index.js');

      // Cria instância com o adapter
      this.prisma = new PrismaClient({
        adapter,
      });

      console.log(`✅ Schema ${this.schema} criado com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao criar schema ${this.schema}:`, error);
      throw error;
    }
  }

  async teardown(): Promise<void> {
    try {
      console.log(`🧹 Removendo schema de teste: ${this.schema}`);

      // Desconecta o Prisma Client se ele existir
      if (this.prisma) {
        await this.prisma.$disconnect();
      }

      // Fecha o pool se ele existir
      if (this.pool) {
        await this.pool.end();
      }

      // Restaura a URL original e cria conexão temporária para deletar o schema
      process.env.DATABASE_URL = this.originalDatabaseUrl;

      const tempPool = new Pool({
        connectionString: this.originalDatabaseUrl,
      });

      const tempAdapter = new PrismaPg(tempPool);

      const prismaTemp = new PrismaClient({
        adapter: tempAdapter,
      });

      // Deleta o schema
      await prismaTemp.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE;`);
      await prismaTemp.$disconnect();
      await tempPool.end();

      console.log(`✅ Schema ${this.schema} removido com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao remover schema ${this.schema}:`, error);
    }
  }

  getSchema(): string {
    return this.schema;
  }

  getDatabaseUrl(): string {
    return this.databaseUrl;
  }

  getPool(): Pool | null {
    return this.pool;
  }
}