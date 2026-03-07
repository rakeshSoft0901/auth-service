import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import logger from './config/logger'
import { HttpError } from 'http-errors'
import authRoutes from './routes/auth'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  // const err = createHttpError(401, 'Bad Request')
  // next(err)
  res.status(200).json({ message: 'Hello World sdf' })
})

app.use('/auth', authRoutes)

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
