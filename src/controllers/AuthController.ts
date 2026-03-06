import { NextFunction, Response } from 'express'
import { RegisterRequestBody } from '../types/user.type'
import { UserService } from '../services/UserService'
import { Logger } from 'winston'
export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async register(req: RegisterRequestBody, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName, role } = req.body

      await this.userService.create({
        email,
        password,
        firstName,
        lastName,
        role,
      })
      this.logger.info(`User registered: ${email}`)

      res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
      next(err)
      return
    }
  }
}
