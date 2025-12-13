import { InMemoryUsersRepository } from '@src/repositories/in-memory/in-memory-users-repository.js'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from '../auth/register.use-case.js'
import { UserAlreadyExistError } from './user-already-exist.error.js'

// Unit tests cannot be integration tests. No Database interation
describe('Register Use Case', () => {

  it('should be able to register', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    const { user } = await registerUseCase.execute({
      name: "Mr Whatsit",
      email: "mrwhatsit@gmail.com",
      password: "123456"
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    const { user } = await registerUseCase.execute({
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
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    const email: string = "mrwhatsit@gmail.com"

    await registerUseCase.execute({
      name: "Mr Whatsit",
      email,
      password: "123456"
    })

    await expect(
      registerUseCase.execute({
        name: "Mr Whatsit",
        email,
        password: "123456"
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

})