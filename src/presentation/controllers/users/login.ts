
import { InvalidCredentialsError } from "@src/use-cases/erros/invalid-credentials.error.js";
import { makeLoginUseCase } from "@src/use-cases/factories/make-login.use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function login(request: FastifyRequest, reply: FastifyReply) {

  const loginBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6)
  })

  const { email, password } = loginBodySchema.parse(request.body)

  try {

    const loginUseCase = makeLoginUseCase()
    const { user } = await loginUseCase.execute({
      email,
      password
    })

    const token = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id,

        }
      }
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d"

        }
      }
    )

    return reply.status(200).setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true
    }

    ).send({
      message: 'Auth User Sucessful',
      token
    })

  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send(
        error.message
      )
    }
    throw error
  }

}