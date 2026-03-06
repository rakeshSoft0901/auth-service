import { NextFunction, Response } from 'express'
import { JwtPayload, sign } from 'jsonwebtoken'
import { RegisterRequestBody } from '../types/user.type'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { readFileSync } from 'fs'
import path from 'path'
import createHttpError from 'http-errors'
import Config from '../config'
export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async register(req: RegisterRequestBody, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, role } = req.body

      const validate = validationResult(req)
      if (!validate.isEmpty()) {
        res.status(400).json({ errors: validate.array() })
        return
      }

      const user = await this.userService.create({
        email,
        password,
        firstName,
        lastName,
        role,
      })
      this.logger.info(`User registered: ${email}`)

      let privateKey: Buffer
      try {
        privateKey = readFileSync(
          path.join(__dirname, '../../certs/private.pem'),
        )
      } catch (err) {
        const error = createHttpError(500, 'Error reading private key', {
          cause: err,
        })
        next(error)
        return
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        email: user.email,
        role: user.role,
      }
      const accessToken = sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h',
        issuer: 'auth-service',
      })

      if (!Config.REFRESH_TOKEN_SECRET) {
        const error = createHttpError(
          500,
          'Refresh token secret not configured',
        )
        next(error)
        return
      }

      const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '7d',
        issuer: 'auth-service',
      })

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 15 minutes
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
      next(err)
      return
    }
  }
}
