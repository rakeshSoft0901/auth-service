import { Repository } from 'typeorm'
import { ITenant } from '../types/tenant.type'
import { Tenant } from '../entity/Tenant'

export class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create(tenantData: ITenant) {
    return await this.tenantRepository.save(tenantData)
  }
}
