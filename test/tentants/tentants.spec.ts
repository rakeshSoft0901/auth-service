import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/data-source'
import request from 'supertest'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'

describe('Tentant', () => {
  let connection: DataSource

  beforeAll(async () => {
    connection = await AppDataSource.initialize()
  })

  beforeEach(async () => {
    await connection.dropDatabase()
    await connection.synchronize()
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

      const response = await request(app).post('/tenants').send(tenantData)

      expect(response.statusCode).toBe(201)
    })

    it('should create a tenant in the database', async () => {
      const tenantData = {
        name: 'Tenant name',
        address: 'Tenant address',
      }

      await request(app).post('/tenants').send(tenantData)

      const tentantReposigtory = connection.getRepository(Tenant)
      const tenant = await tentantReposigtory.find()

      expect(tenant).toHaveLength(1)
      expect(tenant[0].name).toBe(tenantData.name)
    })
  })
})
