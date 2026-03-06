import express, { Request, Response, NextFunction } from 'express'
import { AuthController } from '../controllers/AuthController'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import { TokenService } from '../services/TokenService'
import { RefreshToken } from '../entity/RefreshToken'
import {
  loginValidator,
  registerValidator,
} from '../validators/register-validator'

const router = express.Router()

const userRepository = AppDataSource.getRepository(User)
const tokenRepository = AppDataSource.getRepository(RefreshToken)
const userService = new UserService(userRepository)
const tokenService = new TokenService(tokenRepository)
const authController = new AuthController(userService, logger, tokenService)

router.post(
  '/register',
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
)

router.post(
  '/login',
  loginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
)

export default router
