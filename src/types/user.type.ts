import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export interface UserData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

export interface RegisterRequestBody extends Request {
  body: UserData
}

export interface LoginRequestBody extends Request {
  body: {
    email: string
    password: string
  }
}

export interface AccessTokenPayload extends JwtPayload {
  sub: string
  email: string
}
// export interface TokenPayload {
//   id: number
//   email: string
//   role: string
// }
