import { Response } from 'express'
import { RegisterRequestBody } from '../types/user.type'
import { UserService } from '../services/UserService'
export class AuthController {
  constructor(private userService: UserService) {}

  async register(req: RegisterRequestBody, res: Response) {
    const { email, password, firstName, lastName } = req.body

    await this.userService.create({ email, password, firstName, lastName })

    res.status(201).json({ message: 'User registered successfully' })
  }
}
