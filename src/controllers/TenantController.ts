import { NextFunction, Request, Response } from 'express'
import { TenantService } from '../services/TenantService'
import { ITenantRequest } from '../types/tenant.type'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'

export class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger,
  ) {}

  async create(req: ITenantRequest, res: Response, next: NextFunction) {
    try {
      const validate = validationResult(req)
      if (!validate.isEmpty()) {
        res.status(400).json({ errors: validate.array() })
        return
      }

      const { name, address } = req.body
      const tenant = await this.tenantService.create({ name, address })
      this.logger.info('Tenant has been created', { id: tenant.id })
      res.status(201).json({ message: 'succesfully created', tenant })
    } catch (err) {
      next(err)
    }
  }

  async all(req: Request, res: Response) {
    const allTenant = await this.tenantService.getAll()
    res
      .status(200)
      .json({ tenants: allTenant, message: 'Succesfully get all tenants' })
  }

  async get(req: Request, res: Response) {
    const id = Number(req.params.id)
    const tenant = await this.tenantService.get(id)
    res.status(200).json({ tenant: tenant, message: 'Succesfully get tenant' })
  }

  async update(req: ITenantRequest, res: Response, next: NextFunction) {
    try {
      const { name, address } = req.body
      const id: number = Number(req.params.id)
      const validate = validationResult(req)
      if (!validate.isEmpty()) {
        res.status(400).json({ errors: validate.array() })
        return
      }
      const tenant = await this.tenantService.update(id, { name, address })
      res.status(200).json({ tenant, message: 'Succesfully Update' })
    } catch (err) {
      next(err)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      await this.tenantService.delete(id)
      res.status(200).json({ message: 'Succesfully delete' })
    } catch (err) {
      next(err)
    }
  }
}
