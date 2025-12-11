import { defineConfig, env } from "prisma/config";
import { config } from "dotenv";

// Carrega as variáveis do .env
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});