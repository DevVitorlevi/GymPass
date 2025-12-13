import type { FastifyInstance } from "fastify";
import { register } from "../controller/auth/register.js";
import { login } from "../controller/auth/login.js";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/login', login)
}