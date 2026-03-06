import app from './app'
import Config from './config'
import logger from './config/logger'
import { AppDataSource } from './data-source'

async function start() {
  try {
    const PORT = Config.PORT
    await AppDataSource.initialize()
    logger.info('Database connected')
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

start().catch((err) => {
  console.error('Unhandled error:', err)
})
