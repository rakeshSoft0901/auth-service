import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/data-source'
import request from 'supertest'
import app from '../../src/app'
import { Roles } from '../../src/constants'
import { JwtPayload } from 'jsonwebtoken'
import { TokenService } from '../../src/services/TokenService'
import { RefreshToken } from '../../src/entity/RefreshToken'
import { User } from '../../src/entity/User'
import { Tenant } from '../../src/entity/Tenant'

describe('Tentant', () => {
  let connection: DataSource
  let adminToken: string

  beforeAll(async () => {
    connection = await AppDataSource.initialize()
  })

  beforeEach(async () => {
    await connection.dropDatabase()
    await connection.synchronize()

    const userData = {
      email: 'user@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: Roles.ADMIN,
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
    adminToken = tokenService.generateAccessToken(payload)
  })

  afterAll(async () => {
    await connection.destroy()
  })

  describe('Given all fields', () => {
    it('should return a 201 status code', async () => {
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      }

      const response = await request(app)
        .post('/tenants')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(tenantData)

      expect(response.statusCode).toBe(201)
    })

    it('should create a tenant in the database', async () => {
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      }

      await request(app)
        .post('/tenants')
        .set('Cookie', [`accessToken=${adminToken}`])
        .send(tenantData)

      const tentantReposigtory = connection.getRepository(Tenant)
      const tenant = await tentantReposigtory.find()

      expect(tenant).toHaveLength(1)
      expect(tenant[0].name).toBe(tenantData.name)
    })

    it('should return 401 if user is not authenticated', async () => {
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      }

      const response = await request(app).post('/tenants').send(tenantData)

      expect(response.statusCode).toBe(401)
    })

    it('should return 403 if user is not an admin', async () => {
      const userData = {
        email: 'managerUser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.MANAGER,
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
      const managerToken = tokenService.generateAccessToken(payload)
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      }

      const response = await request(app)
        .post('/tenants')
        .set('Cookie', [`accessToken=${managerToken}`])
        .send(tenantData)

      expect(response.statusCode).toBe(403)
    })
  })
})
