import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

/**
 * Custom JSON format for logs
 */
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Console format (readable for development)
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

/**
 * Transport: Console (development only)
 */
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: NODE_ENV === 'development' ? LOG_LEVEL : 'warn',
});

/**
 * Transport: Error log file
 */
const errorFileTransport = new winston.transports.File({
  filename: path.join(logsDir, 'error.log'),
  level: 'error',
  format: customFormat,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
});

/**
 * Transport: Combined log file
 */
const combinedFileTransport = new winston.transports.File({
  filename: path.join(logsDir, 'combined.log'),
  format: customFormat,
  level: LOG_LEVEL,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
});

/**
 * Initialize Winston logger with transports
 */
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: customFormat,
  defaultMeta: { service: 'comuniapp-api' },
  transports: [
    consoleTransport,
    errorFileTransport,
    combinedFileTransport,
  ],
});

/**
 * Handle uncaught exceptions
 */
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(logsDir, 'exceptions.log'),
    format: customFormat,
  })
);

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default logger;
