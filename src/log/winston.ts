import winston from 'winston';
import fs from 'fs';
const env = process.env.NODE_ENV;

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.File({
      filename: './logs/system.log',
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
