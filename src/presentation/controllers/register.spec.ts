import { app } from "@src/app.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it("should be able register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "Mr whatsit",
      email: "mrwhatsit11212@gmail.com",
      password: "1234456"
    })

    expect(response.statusCode).toEqual(201)
  })
})