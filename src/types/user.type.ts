import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export interface UserData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

export interface IUpdateUserData {
  firstName: string
  lastName: string
}

export interface IUpdateRequestBody extends Request {
  body: IUpdateUserData
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

export interface RefreshTokenPayload extends JwtPayload {
  id: string
}
// export interface TokenPayload {
//   id: number
//   email: string
//   role: string
// }
