import { readFileSync } from 'fs'
import createHttpError from 'http-errors'
import path from 'path'
import { JwtPayload, sign } from 'jsonwebtoken'
import Config from '../config'
import { RefreshToken } from '../entity/RefreshToken'
import { User } from '../entity/User'
import { Repository } from 'typeorm'

export class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

  generateAccessToken(payload: JwtPayload) {
    let privateKey: Buffer
    try {
      privateKey = readFileSync(path.join(__dirname, '../../certs/private.pem'))
    } catch (err) {
      const error = createHttpError(500, 'Error reading private key', {
        cause: err,
      })
      throw error
    }

    const accessToken = sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'auth-service',
    })
    return accessToken
  }

  generateRefreshToken(payload: JwtPayload) {
    if (!Config.REFRESH_TOKEN_SECRET) {
      const error = createHttpError(500, 'Refresh token secret not configured')
      throw error
    }

    const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7d',
      issuer: 'auth-service',
      jwtid: payload.id as string, // Use the ID of the refresh token record
    })
    return refreshToken
  }

  async persistRefreshToken(user: User) {
    const newRefreshToken = await this.refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })
    return newRefreshToken
  }
}
