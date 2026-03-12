import { Repository } from 'typeorm'
import { ITenant } from '../types/tenant.type'
import { Tenant } from '../entity/Tenant'
import createHttpError from 'http-errors'

export class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create(tenantData: ITenant) {
    return await this.tenantRepository.save(tenantData)
  }

  async getAll() {
    return await this.tenantRepository.find()
  }

  async get(id: number) {
    return await this.tenantRepository.findBy({ id })
  }

  async update(id: number, tenantData: ITenant) {
    const tenant = await this.tenantRepository.findOne({ where: { id: id } })

    if (!tenant) {
      throw createHttpError(400, 'Tenant not found')
    }

    tenant.name = tenantData.name
    tenant.address = tenantData.address

    return await this.tenantRepository.save(tenant)
  }

  async delete(id: number) {
    await this.tenantRepository.delete({ id })
  }
}
