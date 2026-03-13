import { NextFunction, Request, Response } from 'express'
import { IUpdateRequestBody, RegisterRequestBody } from '../types/user.type'
import { UserService } from '../services/UserService'
import { Roles } from '../constants'
import { validationResult } from 'express-validator'

export class UserController {
  constructor(private userService: UserService) {}

  async userList(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.all()
      res.status(200).json({ users, message: 'successfully get user list' })
    } catch (err) {
      next(err)
      return
    }
  }

  async create(req: RegisterRequestBody, res: Response, next: NextFunction) {
    try {
      const validate = validationResult(req)
      if (!validate.isEmpty()) {
        res.status(400).json({ errors: validate.array() })
      }

      const { email, password, firstName, lastName } = req.body
      const user = await this.userService.create({
        email,
        password,
        firstName,
        lastName,
        role: Roles.MANAGER,
      })
      res.status(201).json({ message: 'User Created succesfully', user })
    } catch (err) {
      next(err)
      return
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id)
      const user = await this.userService.getUserById(userId)
      res.status(200).json({ user, message: 'Succesfully get user' })
    } catch (err) {
      next(err)
      return
    }
  }

  async update(req: IUpdateRequestBody, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id)
      const { firstName, lastName } = req.body
      const user = await this.userService.update(userId, {
        firstName,
        lastName,
      })
      res.status(200).json({ user, message: 'Update Succesfull' })
    } catch (err) {
      next(err)
      return
    }
  }

  // delete user
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id)
      await this.userService.delete(userId)
      res.status(200).json({ message: 'User deleted successfully' })
    } catch (err) {
      next(err)
      return
    }
  }
}
