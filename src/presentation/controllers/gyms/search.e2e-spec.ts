import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createE2EApp, destroyE2EApp } from "../../../../test/utils/create-e2e-app.js";
import { PrismaTestEnvironment } from "../../../../test/utils/prisma-test-environment.js";

describe("search (e2e)", () => {
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

  it("should be able to search gym", async () => {

    const authResponse = await request(app.server).post("/login").send({
      email: "mrwhatsit1xxx@gmail.com",
      password: "1234456"
    });
    const { token } = authResponse.body

    await request(app.server).post('/gyms').set("Authorization", `Bearer ${token}`).send({
      title: "Gym",
      description: "Gym Peroba",
      phone: "(88) 999999",
      latitude: -4.7607794,
      longitude: - 37.382672,
    })

    await request(app.server).post('/gyms').set("Authorization", `Bearer ${token}`).send({
      title: "Gym780123087123",
      description: "Gym Peroba",
      phone: "(88) 999999",
      latitude: -4.7607794,
      longitude: - 37.382672,
    })

    const searchResponse = await request(app.server).get('/gyms/search').query({ title: '780123087123' }).set("Authorization", `Bearer ${token}`).send()

    expect(searchResponse.statusCode).toEqual(200)
    expect(searchResponse.body.gyms).toHaveLength(2)
    expect(searchResponse.body.gyms).toEqual([
      {
        title: "Gym780123087123"
      }
    ])

  });
})