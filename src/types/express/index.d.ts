import { User } from '../../entity/User'

export {}

declare module 'express' {
  interface Request {
    user?: User
    cookies?: {
      accessToken: string
    }
  }
}
