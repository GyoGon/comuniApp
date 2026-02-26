import logger from '../utils/logger.js';

/**
 * Middleware to log all HTTP requests
 * Logs: method, path, status code, response time, user_id (if authenticated)
 */
export const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Capture the original res.json method
  const originalJson = res.json;

  // Override res.json to log the response
  res.json = function (data) {
    const responseTime = Date.now() - startTime;
    const userId = req.user?.id || null;
    const statusCode = res.statusCode;

    // Log request details
    const logData = {
      method: req.method,
      path: req.path,
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
      statusCode,
      responseTime: `${responseTime}ms`,
      userId,
      ip: req.ip,
    };

    // Determine log level based on status code
    if (statusCode >= 500) {
      logger.error('HTTP Request', logData);
    } else if (statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }

    // Call original json method
    return originalJson.call(this, data);
  };

  next();
};

export default loggerMiddleware;
