import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from '../auth/register.use-case.js'


describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async findEmail(email) {
        return null
      },
      async create(data) {
        return {
          id: "user-1",
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          create_at: new Date()
        }

      },
    })

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
})