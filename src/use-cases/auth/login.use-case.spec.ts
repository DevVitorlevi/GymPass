import { InMemoryUsersRepository } from "@src/repositories/in-memory/in-memory-users-repository.js";
import { hash } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { InvalidCredentialsError } from "../erros/invalid-credentials.error.js";
import { LoginUseCase } from "./login.use-case.js";

describe('Login Use Case', () => {

  it("should be able auth", async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new LoginUseCase(usersRepository)

    await usersRepository.create({
      id: 'user-1',
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password_hash: await hash('123456', 6)
    })

    const { user } = await sut.execute({
      email: 'jonhdoe@email.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should not be able auth with wrong email", async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new LoginUseCase(usersRepository)

    await expect(
      sut.execute({
        email: 'jonhdo@email.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able auth with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new LoginUseCase(usersRepository)

    await usersRepository.create({
      id: 'user-1',
      name: "Jonh Doe",
      email: "jonhdoe@email.com",
      password_hash: await hash('123456', 6)
    })

    await expect(
      sut.execute({
        email: 'jonhdo@email.com',
        password: '12321236'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})