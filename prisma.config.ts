import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Carrega as variáveis do .env
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL_PRISMA"),
  },
});
