import app from './app'
import Config from './config'
import logger from './config/logger'

function start() {
  try {
    const PORT = Config.PORT
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

start()
