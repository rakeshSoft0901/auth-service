import express, { NextFunction, Request, Response } from 'express'
import logger from './config/logger'
import createHttpError, { HttpError } from 'http-errors'

const app = express()

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  const err = createHttpError(401, 'Bad Request')
  next(err)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message)
  const statusCode = err.status || 500
  res.status(statusCode).json({
    error: [
      {
        type: err.name,
        message: err.message,
        path: '',
        location: '',
      },
    ],
  })
})

export default app
