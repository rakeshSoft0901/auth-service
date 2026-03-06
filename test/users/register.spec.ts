import request from 'supertest'
import app from '../../src/app'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'

describe('Post /auth/register', () => {
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

  describe('Given a valid request body', () => {
    it('should return a 201 status code', async () => {
      //AAA
      //Arrange, Act, Assert
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.CUSTOMER,
      }

      const response = await request(app).post('/auth/register').send(userData)

      console.log(response.body)

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
        role: Roles.CUSTOMER,
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
        role: Roles.CUSTOMER,
      }

      await request(app).post('/auth/register').send(userData)
      const userRepository = connection.getRepository(User)
      const users = await userRepository.find()
      expect(users).toHaveLength(1)
      expect(users[0].email).toBe(userData.email)
    })

    it('should assign a customer role', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.CUSTOMER,
      }

      await request(app).post('/auth/register').send(userData)
      const userRepository = connection.getRepository(User)
      const users = await userRepository.find()
      expect(users).toHaveLength(1)
      expect(users[0].role).toBe(Roles.CUSTOMER)
    })

    it('should store the password securely', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.CUSTOMER,
      }

      await request(app).post('/auth/register').send(userData)
      const userRepository = connection.getRepository(User)
      const users = await userRepository.find()
      expect(users).toHaveLength(1)
      expect(users[0].password).not.toBe(userData.password)
      expect(users[0].password).toHaveLength(60) // bcrypt hashes are typically 60 characters long
    })

    it('should return a 400 status code if email is already present', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.CUSTOMER,
      }

      const userRepository = connection.getRepository(User)
      await userRepository.save(userData)

      const response = await request(app).post('/auth/register').send(userData)
      expect(response.status).toBe(400)
      expect(response.body.error[0]).toHaveProperty(
        'message',
        'Email already exists',
      )
    })

    it('should return the access token and refresh token inside a cookie', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.CUSTOMER,
      }

      const response = await request(app).post('/auth/register').send(userData)

      let accessToken = null
      let refreshToken = null
      const cookies = response.headers['set-cookie']

      if (Array.isArray(cookies)) {
        cookies.forEach((cookie) => {
          if (cookie.startsWith('accessToken=')) {
            accessToken = cookie.split(';')[0].split('=')[1]
          }

          if (cookie.startsWith('refreshToken=')) {
            refreshToken = cookie.split(';')[0].split('=')[1]
          }
        })
      }

      expect(accessToken).not.toBeNull()
      expect(refreshToken).not.toBeNull()
    })
  })

  describe('Given an invalid request body', () => {
    it('should return a 400 status code', async () => {
      const userData = {
        email: '',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.CUSTOMER,
      }

      const response = await request(app).post('/auth/register').send(userData)
      expect(response.status).toBe(400)
    })

    it('should trim the email field', async () => {
      const userData = {
        email: ' user@example.com ',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Roles.CUSTOMER,
      }

      await request(app).post('/auth/register').send(userData)

      const userRepository = connection.getRepository(User)
      const users = await userRepository.find()
      expect(users).toHaveLength(1)
      expect(users[0].email).toBe('user@example.com')
    })
  })
})
