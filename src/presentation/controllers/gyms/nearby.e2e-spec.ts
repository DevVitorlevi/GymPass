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

  it("should be able to nearby gym", async () => {

    const authResponse = await request(app.server).post("/login").send({
      email: "mrwhatsit1xxx@gmail.com",
      password: "1234456"
    });
    const { token } = authResponse.body

    await request(app.server).post('/gyms').set("Authorization", `Bearer ${token}`).send({
      title: "Academia Redonda",
      description: "Academia la de Redonda",
      phone: "(88)99999-9999",
      latitude: -4.7607794,
      longitude: -37.302672
    })

    await request(app.server).post('/gyms').set("Authorization", `Bearer ${token}`).send({
      title: "Academia Peroba",
      description: "Academia la de Peroba",
      phone: "(88)99999-9999",
      latitude: -4.7067794,
      longitude: -37.382672
    })

    await request(app.server).post('/gyms').set("Authorization", `Bearer ${token}`).send({
      title: "Academia  Vila Nova",
      description: "Academia la de Vila Nova",
      phone: "(88)99999-9999",
      latitude: -4.6257794,
      longitude: -37.382672
    })

    const response = await request(app.server).get('/gyms/nearby').query({
      latitude: -4.7067794,
      longitude: -37.382672
    }).set("Authorization", `Bearer ${token}`).send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(2)
    expect(response.body.gyms).toEqual([
      {
        title: "Academia Peroba"
      }
    ])
  });
})