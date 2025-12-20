import { verifyJWT } from "@src/presentation/middlewares/verify-jwt.js";
import type { FastifyInstance } from "fastify";
import { create } from "./create.js";
import { history } from "./history.js";
import { metrics } from "./metrics.js";
import { validate } from "./validate.js";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.post('/gyms/:gymId/check-in', create)
  app.patch('/check-ins/:checkInId/validate', validate)
  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
}