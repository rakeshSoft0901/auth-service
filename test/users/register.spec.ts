import request from 'supertest'
import app from '../../src/app'

describe('Post /auth/register', () => {
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
  })

  describe('Given an invalid request body', () => {})
})
