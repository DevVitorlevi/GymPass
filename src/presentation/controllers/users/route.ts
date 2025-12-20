import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { login } from "./login.js";
import { profile } from "./profile.js";
import { refresh } from "./refresh.js";
import { register } from "./register.js";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/login', login)
  app.patch('/token/refresh', refresh)
  app.get('/me', { onRequest: [verifyJWT] }, profile)

}