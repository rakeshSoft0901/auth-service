import { NextFunction, Response } from 'express'
import { TenantService } from '../services/TenantService'
import { ITenantRequest } from '../types/tenant.type'
import { Logger } from 'winston'

export class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger,
  ) {}

  async create(req: ITenantRequest, res: Response, next: NextFunction) {
    try {
      const { name, address } = req.body
      const tenant = await this.tenantService.create({ name, address })
      this.logger.info('Tenant has been created', { id: tenant.id })
      res.status(201).json({ message: 'succesfully created', tenant })
    } catch (err) {
      next(err)
    }
  }
}
