import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository.js'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistError } from '../erros/user-already-exist.error.js'
import { RegisterUseCase } from './register.use-case.js'


let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

// Unit tests cannot be integration tests. No Database interation
describe('Register Use Case', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: "Mr Whatsit",
      email: "mrwhatsit@gmail.com",
      password: "123456"
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {

    const { user } = await sut.execute({
      name: "Mr Whatsit",
      email: "mrwhatsit@gmail.com",
      password: "123456"
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456', user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("should not be able to register with same email twice", async () => {


    const email: string = "mrwhatsit@gmail.com"

    await sut.execute({
      name: "Mr Whatsit",
      email,
      password: "123456"
    })

    await expect(
      sut.execute({
        name: "Mr Whatsit",
        email,
        password: "123456"
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

})