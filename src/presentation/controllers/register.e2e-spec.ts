import { randomUUID } from "crypto";
import type { FastifyInstance } from "fastify";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createE2EApp, destroyE2EApp } from "../../../test/utils/create-e2e-app.js";
import { PrismaTestEnvironment } from "../../../test/utils/prisma-test-environment.js";

describe("Register (e2e)", () => {
  let app: FastifyInstance;
  let testEnv: PrismaTestEnvironment;

  beforeAll(async () => {
    console.log('🔍 DATABASE_URL antes do setup:', process.env.DATABASE_URL);
    const setup = await createE2EApp();
    app = setup.app;
    testEnv = setup.testEnv;
    console.log('🔍 DATABASE_URL depois do setup:', process.env.DATABASE_URL);
    console.log('🔍 Schema de teste:', testEnv.getSchema());
  });
  afterAll(async () => {
    await destroyE2EApp({ app, testEnv });
  });

  it("should be able register", async () => {

    const response = await request(app.server).post("/users").send({
      name: "Mr whatsit",
      email: `whatsit${randomUUID()}@gmail.com`,
      password: "1234456"
    });

    expect(response.statusCode).toEqual(201);
  });
})