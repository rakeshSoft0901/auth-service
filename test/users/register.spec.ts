import request from 'supertest'
import app from '../../src/app'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/data-source'
import { truncateTables } from '../utils'
import { User } from '../../src/entity/User'

describe('Post /auth/register', () => {
  let connection: DataSource

  beforeAll(async () => {
    connection = await AppDataSource.initialize()
  })

  beforeEach(async () => {
    await truncateTables(connection)
  })

  afterAll(async () => {
    await connection.destroy()
  })

  describe('Given a valid request body', () => {
    it('should return a 201 status code', async () => {
      //AAA
      //Arrange, Act, Assert
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const response = await request(app).post('/auth/register').send(userData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty(
        'message',
        'User registered successfully',
      )
    })

    it('should return a json response', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }

      const response = await request(app).post('/auth/register').send(userData)
      expect(
        (response.headers as Record<string, string>)['content-type'],
      ).toEqual(expect.stringContaining('application/json'))
    })

    it('should persist the user in the database', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      }

      await request(app).post('/auth/register').send(userData)
      const userRepository = connection.getRepository(User)
      const users = await userRepository.find()
      expect(users).toHaveLength(1)
      expect(users[0].email).toBe(userData.email)
    })
  })

  describe('Given an invalid request body', () => {})
})
