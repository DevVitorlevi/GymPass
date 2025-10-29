import fastify from "fastify"
import { appRoutes } from "./http/routes/route.js"
export const app = fastify()

app.register(appRoutes)