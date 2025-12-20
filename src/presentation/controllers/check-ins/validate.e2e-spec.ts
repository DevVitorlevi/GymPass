import { prisma } from "@src/lib/prisma.js";
import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createE2EApp, destroyE2EApp } from "../../../../test/utils/create-e2e-app.js";
import { PrismaTestEnvironment } from "../../../../test/utils/prisma-test-environment.js";

describe("Metrics (e2e)", () => {
  let app: FastifyInstance;
  let testEnv: PrismaTestEnvironment;

  beforeAll(async () => {
    const setup = await createE2EApp();
    app = setup.app;
    testEnv = setup.testEnv;
  });

  afterAll(async () => {
    await destroyE2EApp({ app, testEnv });
  });

  it("should be able to count metrics", async () => {

    const authResponse = await request(app.server).post("/login").send({
      email: "mrwhatsit1xxx@gmail.com",
      password: "1234456"
    });

    const { token } = authResponse.body

    const user = await prisma.user.create({
      data: {
        name: "Vitor Levi",
        email: "levivitor8@gmail.com",
        password_hash: await hash("123456", 6),
      }
    })

    const gym = await prisma.gym.create({
      data: {
        title: "JS Gym",
        latitude: -4.7607794,
        longitude: - 37.382672,
      }
    })

    let checkIns = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id
      }
    })

    const response = await request(app.server).patch(`/check-ins/${checkIns.id}/validate`).set("Authorization", `Bearer ${token}`).send()

    expect(response.statusCode).toEqual(204)

    checkIns = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIns.id
      }
    })
    expect(checkIns.validaded_at).toEqual(expect.any(Date))
  });
})