import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.File({
      filename: 'system.log',
      format: winston.format.printf(
        info => `${new Date().toLocaleTimeString()} [${info.level.toUpperCase()}] - ${info.message}`)
    }),
    new winston.transports.Console({
      format: winston.format.printf(
        info => `${new Date().toLocaleTimeString()} [${info.level.toUpperCase()}] - ${info.message}`)
    })
  ]
});

export default logger;
