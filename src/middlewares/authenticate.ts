import { NextFunction, Request, Response } from 'express'
import { readFileSync } from 'fs'
import jwt from 'jsonwebtoken'
import path from 'path'
import { AppDataSource } from '../data-source'
import { User } from '../entity/User'
import { AccessTokenPayload } from '../types/user.type'

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies?.accessToken as string

  if (!accessToken) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const publicKey = readFileSync(
    path.join(__dirname, '../../certs/public.pem'),
    'utf8',
  )

  try {
    const payload = jwt.verify(accessToken, publicKey, {
      algorithms: ['RS256'],
    })

    if (typeof payload === 'string') {
      res.status(401).json({ message: 'Invalid token' })
      return
    }

    const { email } = payload as AccessTokenPayload
    const userRepogistory = AppDataSource.getRepository(User)
    const user = await userRepogistory.findOneBy({ email })
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }

    req.user = user
    next()
  } catch (err) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>', err)
  }
}
