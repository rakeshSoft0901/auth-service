import { Request } from 'express'

export interface ITenant {
  name: string
  address: string
}

export interface ITenantRequest extends Request {
  body: ITenant
}
