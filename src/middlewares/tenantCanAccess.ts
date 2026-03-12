import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'

export const tenantCanAccess = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!roles.includes(user.role)) {
      const error = createHttpError(403, "You don't have enough permissions")
      next(error)
      return
    }
    next()
  }
}
