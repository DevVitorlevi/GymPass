import type { FastifyInstance } from "fastify";
import { login } from "../controllers/login.js";
import { profile } from "../controllers/profile.js";
import { register } from "../controllers/register.js";
import { verifyJWT } from "../controllers/verify-jwt.js";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/login', login)
  app.get('/me', { onRequest: [verifyJWT] }, profile)

}