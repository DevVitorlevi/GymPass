import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createE2EApp, destroyE2EApp } from "../../../test/utils/create-e2e-app.js";
import { PrismaTestEnvironment } from "../../../test/utils/prisma-test-environment.js";

describe("Register (e2e)", () => {
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

  it("should be able to get profile", async () => {
    const authResponse = await request(app.server).post("/login").send({
      email: "mrwhatsit1xxx@gmail.com",
      password: "1234456"
    });
    const { token } = authResponse.body

    const profileResponse = await request(app.server).get('/me').set("Authorization", `Bearer ${token}`).send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: "mrwhatsit1xxx@gmail.com"
      })
    )

  });
})