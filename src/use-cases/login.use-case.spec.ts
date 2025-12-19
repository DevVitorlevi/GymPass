import { InMemoryUsersRepository } from "@src/repositories/in-memory/in-memory-users-repository.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InvalidCredentialsError } from "./erros/invalid-credentials.error.js";
import { LoginUseCase } from "./login.use-case.js";

let usersRepository: InMemoryUsersRepository
let sut: LoginUseCase
describe('Login Use Case', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository
    sut = new LoginUseCase(usersRepository)
  })

  it("should be able auth", async () => {

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

    await expect(
      sut.execute({
        email: 'jonhdo@email.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able auth with wrong password', async () => {

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