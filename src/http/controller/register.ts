import { prisma } from "@src/lib/prisma.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { hash } from "bcryptjs";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {

  const resgisterBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6)
  })

  const { name, email, password } = resgisterBodySchema.parse(request.body)

  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (userWithSameEmail) {
    return reply.status(409).send()
  }
  await prisma.user.create({
    data: {
      name,
      email,
      password_hash
    }
  })

  return reply.status(201).send()
}