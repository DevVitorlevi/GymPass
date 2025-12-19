import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { login } from "./login.js";
import { profile } from "./profile.js";
import { register } from "./register.js";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/login', login)
  app.get('/me', { onRequest: [verifyJWT] }, profile)

}