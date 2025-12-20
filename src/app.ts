import fastifyJwt from "@fastify/jwt"
import fastify from "fastify"
import z, { ZodError } from "zod"
import { env } from "./env/index.js"
import { checkInsRoutes } from "./presentation/controllers/check-ins/routes.js"
import { gymsRoutes } from "./presentation/controllers/gyms/routes.js"
import { usersRoutes } from "./presentation/controllers/users/route.js"
export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)


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