import { NextFunction, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { LoginRequestBody, RegisterRequestBody } from '../types/user.type'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { TokenService } from '../services/TokenService'
import createHttpError from 'http-errors'
export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
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

      const payload: JwtPayload = {
        sub: String(user.id),
        email: user.email,
        role: user.role,
      }

      const newRefreshToken = await this.tokenService.persistRefreshToken(user)

      const accessToken = this.tokenService.generateAccessToken(payload)

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
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

  async login(req: LoginRequestBody, res: Response, next: NextFunction) {
    const validate = validationResult(req)
    if (!validate.isEmpty()) {
      res.status(400).json({ errors: validate.array() })
      return
    }
    try {
      const { email, password } = req.body
      const user = await this.userService.getUser(email)
      if (!user) {
        const error = createHttpError(400, 'Email or password does not match')
        next(error)
        return
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        const error = createHttpError(400, 'Email or password does not match')
        next(error)
        return
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        email: user.email,
        role: user.role,
      }

      const newRefreshToken = await this.tokenService.persistRefreshToken(user)

      const accessToken = this.tokenService.generateAccessToken(payload)

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
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

      res.status(200).json({ message: 'Login successful', user: user.id })
    } catch (err) {
      next(err)
      return
    }
  }
}
