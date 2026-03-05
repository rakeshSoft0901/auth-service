import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
})

const Config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_HOST: process.env.DB_HOST,
}

export default Config
