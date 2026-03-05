import winston from 'winston'
import Config from '.'

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: 'logs/info.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      silent: Config.NODE_ENV === 'test' || Config.NODE_ENV === 'development',
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'logs/error.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      silent: Config.NODE_ENV === 'test' || Config.NODE_ENV === 'development',
    }),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint(),
      ),
    }),
  ],
})

export default logger
