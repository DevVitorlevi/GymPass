import type { FastifyInstance } from "fastify";
import { login } from "../controller/auth/login.js";
import { register } from "../controller/auth/register.js";
import { getUserProfile } from "../controller/user/getUserProfile.js";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/login', login)
  app.get('/user/:id', getUserProfile)
}