import fastify from "fastify"
import { appRoutes } from "./presentation/routes/route.js"
import z, { ZodError } from "zod"
import { env } from "./env/index.js"
import fastifyJwt from "@fastify/jwt"
export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(appRoutes)
app.setErrorHandler((error, _, reply) => {

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: z.treeifyError(error)
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({
    message: 'Internal Server Error'
  })
})  