import { DataSource } from 'typeorm'
import createJWKSMock from 'mock-jwks'
import { AppDataSource } from '../../src/data-source'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'
import { TokenService } from '../../src/services/TokenService'
import { RefreshToken } from '../../src/entity/RefreshToken'
import { JwtPayload } from 'jsonwebtoken'

describe('GET /auth/self', () => {
  let connection: DataSource
  let jwks: ReturnType<typeof createJWKSMock>

  beforeAll(async () => {
    jwks = createJWKSMock('http://localhost:5000')
    connection = await AppDataSource.initialize()
  })

  beforeEach(async () => {
    jwks.start()
    await connection.dropDatabase()
    await connection.synchronize()
  })

  afterEach(async () => {
    await jwks.stop()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  describe('Given a valid access token', () => {
    it('should return a 200 status code', async () => {
      // register user
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.CUSTOMER,
      }

      const userRepository = connection.getRepository(User)
      const user = await userRepository.save(userData)

      const tokenRepository = AppDataSource.getRepository(RefreshToken)
      const tokenService = new TokenService(tokenRepository)

      // generate token
      const payload: JwtPayload = {
        sub: String(user.id),
        email: user.email,
        role: user.role,
      }
      const accessToken = tokenService.generateAccessToken(payload)
      // add token to cookie
      // make request to /auth/self
      const response = await request(app)
        .get('/auth/self')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send()
      expect(response.status).toBe(200)
      // Arrange
    })

    it('should return the user data', async () => {
      // register user
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.CUSTOMER,
      }
      const userRepository = connection.getRepository(User)
      const user = await userRepository.save(userData)
      // generate token
      const tokenRepository = AppDataSource.getRepository(RefreshToken)
      const tokenService = new TokenService(tokenRepository)

      const payload: JwtPayload = {
        sub: String(user.id),
        email: user.email,
        role: user.role,
      }
      const accessToken = tokenService.generateAccessToken(payload)
      // add token to cookie
      // make request to /auth/self
      const response = await request(app)
        .get('/auth/self')
        .set('Cookie', [`accessToken=${accessToken}`])
        .send()
      expect((response.body as Record<string, string>).id).toBe(user.id)
    })
  })
})
