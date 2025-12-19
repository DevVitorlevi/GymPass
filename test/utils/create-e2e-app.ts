import fastifyJwt from '@fastify/jwt';
import fastify, { type FastifyInstance } from 'fastify';
import z, { ZodError } from 'zod';
import { PrismaTestEnvironment } from './prisma-test-environment.js';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

interface E2EAppSetup {
  app: FastifyInstance;
  testEnv: PrismaTestEnvironment;
}

/**
 * Cria uma instância da aplicação Fastify com banco de dados isolado para testes E2E
 */
export async function createE2EApp(): Promise<E2EAppSetup> {
  // Cria ambiente de teste com schema isolado
  const testEnv = new PrismaTestEnvironment();
  await testEnv.setup();

  // Sobrescreve a instância global do prisma
  const { setPrisma } = await import('../../src/lib/prisma.js');
  setPrisma(testEnv.prisma);

  // Importa as rotas dinamicamente DEPOIS de configurar o prisma
  const { appRoutes } = await import('../../src/presentation/controllers/users/route.js');

  // Cria uma nova instância do Fastify
  const app = fastify();

  app.register(fastifyJwt, {
    secret: JWT_SECRET,
  });

  app.register(appRoutes);

  app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation Error',
        issues: z.treeifyError(error)
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    return reply.status(500).send({
      message: 'Internal Server Error'
    });
  });

  await app.ready();

  return { app, testEnv };
}

/**
 * Limpa o ambiente de teste e fecha a aplicação
 */
export async function destroyE2EApp(setup: E2EAppSetup): Promise<void> {
  if (setup.app) {
    await setup.app.close();
  }
  if (setup.testEnv) {
    await setup.testEnv.teardown();
  }
}