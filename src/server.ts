import app from './app'
import Config from './config'

function welcome(name: string) {
  try {
    const PORT = Config.PORT
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`, name)
    })
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

welcome('hello')
