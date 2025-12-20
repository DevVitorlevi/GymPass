import { prisma } from "@src/lib/prisma.js";
import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createE2EApp, destroyE2EApp } from "../../../../test/utils/create-e2e-app.js";
import { PrismaTestEnvironment } from "../../../../test/utils/prisma-test-environment.js";

describe("Create (e2e)", () => {
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

  it("should be able to create check in", async () => {

    const authResponse = await request(app.server).post("/login").send({
      email: "mrwhatsit1xxx@gmail.com",
      password: "1234456"
    });

    const { token } = authResponse.body

    const gym = await prisma.gym.create({
      data: {
        title: "JS Gym",
        latitude: -4.7607794,
        longitude: - 37.382672,
      }
    })

    const response = await request(app.server).post(`/gyms/${gym.id}/check-ins`).set("Authorization", `Bearer ${token}`).send({
      latitude: -4.7607794,
      longitude: - 37.382672,
    })

    expect(response.statusCode).toEqual(201)
  });
})