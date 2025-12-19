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

  it("should be able Login", async () => {
    const response = await request(app.server).post("/login").send({
      email: "mrwhatsit1xxx@gmail.com",
      password: "1234456"
    });

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      {
        message: expect.any(String),
        token: expect.any(String)
      }
    )
  });
})