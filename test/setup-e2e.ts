import { config } from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env.test
config({ path: '.env.test' });

// Log para confirmar que o setup foi carregado
console.log('🧪 Setup E2E carregado - DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));