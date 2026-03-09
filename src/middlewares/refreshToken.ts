import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Config from '../config'
import { RefreshTokenPayload } from '../types/user.type'
import { AppDataSource } from '../data-source'
import { RefreshToken } from '../entity/RefreshToken'
import { User } from '../entity/User'

export const validateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refreshToken as string

  if (!refreshToken) {
    res.status(401).json({ message: 'token is not valid' })
    return
  }

  const tokenSecret = Config.REFRESH_TOKEN_SECRET
  if (!tokenSecret) {
    res.status(500).json({ message: 'secret token not found' })
    return
  }

  const payload = jwt.verify(refreshToken, tokenSecret, {
    algorithms: ['HS256'],
  })

  if (typeof payload === 'string') {
    res.status(401).json({ message: 'Invalid token' })
    return
  }

  const { id: refreshTokenId, sub } = payload as RefreshTokenPayload
  if (!refreshTokenId || !sub) {
    res.status(401).json({ message: 'Invalid token payload' })
    return
  }

  const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)
  const token = await refreshTokenRepository.findOne({
    where: {
      id: parseInt(refreshTokenId),
      user: { id: parseInt(sub) },
    },
  })

  if (!token) {
    res.status(401).json({ message: 'Invalid Token' })
    return
  }

  const userRepo = AppDataSource.getRepository(User)
  const user = await userRepo.findOne({
    where: { id: Number(sub) },
  })

  if (!user) {
    res.status(400).json({ message: 'User not found' })
    return
  }

  req.user = user
  req.payload = payload as RefreshTokenPayload
  next()
}
