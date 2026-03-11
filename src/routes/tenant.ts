import express, { NextFunction, Request, Response } from 'express'
import { TenantController } from '../controllers/TenantController'
import { TenantService } from '../services/TenantService'
import { Tenant } from '../entity/Tenant'
import { AppDataSource } from '../data-source'
import logger from '../config/logger'
import { authenticate } from '../middlewares/authenticate'
import { tenantCanAccess } from '../middlewares/tenantCanAccess'
import { Roles } from '../constants'

const router = express.Router()

const tenantRepo = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepo)
const tenantController = new TenantController(tenantService, logger)

router.post(
  '/',
  authenticate,
  tenantCanAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next),
)

export default router
