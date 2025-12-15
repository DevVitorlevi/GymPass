import { InMemoryUsersRepository } from "@src/repositories/in-memory/in-memory-users-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { InvalidCredentialsError } from "../erros/invalid-credentials.error.js";
import { GetUserProfileUseCase } from "./get-user-proflie.use-case.js";

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe("Get User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it("should be able to retrieve a user by id", async () => {
    const user = await usersRepository.create({
      id: "user-1",
      name: "Mr Whatsit",
      email: "mrwhatsit@gmail.com",
      password_hash: "123456",
      create_at: new Date(),
    })

    await sut.execute({
      userID: user.id,
    })

    expect(user.name).toEqual(expect.any(String))
  })

  it("should not be able to retrieve a user by id", async () => {
    await usersRepository.create({
      id: "user-1",
      name: "Mr Whatsit",
      email: "mrwhatsit@gmail.com",
      password_hash: "123456",
      create_at: new Date(),
    })

    await expect(
      sut.execute({
        userID: '12121'
      })

    ).rejects.toBeInstanceOf(InvalidCredentialsError)

  })
})
