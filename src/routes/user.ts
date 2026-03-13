import { NextFunction, Request, Response, Router } from 'express'
import { UserController } from '../controllers/UserController'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../data-source'
import { User } from '../entity/User'

const router = Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const userController = new UserController(userService)

router.post('/', (req: Request, res: Response, next: NextFunction) =>
  userController.create(req, res, next),
)
router.get('/', (req: Request, res: Response, next: NextFunction) =>
  userController.userList(req, res, next),
)
router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  userController.getUser(req, res, next),
)
router.put('/:id', (req: Request, res: Response, next: NextFunction) =>
  userController.update(req, res, next),
)
router.delete('/:id', (req: Request, res: Response, next: NextFunction) =>
  userController.delete(req, res, next),
)

export default router
