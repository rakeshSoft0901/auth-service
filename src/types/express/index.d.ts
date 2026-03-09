import { User } from '../../entity/User'
import { RefreshTokenPayload } from '../user.type'

export {}

declare module 'express' {
  interface Request {
    user?: User
    payload?: RefreshTokenPayload
    cookies?: {
      accessToken: string
    }
  }
}
