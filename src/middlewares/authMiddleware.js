import { verifyAccessToken } from '../utils/jwtHandler.js';
import { createError } from '../utils/errorHandler.js';

/**
 * Middleware to verify JWT token from Authorization header
 * Sets req.user with decoded token data or passes error to next middleware
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const verifyToken = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('Token no proporcionado o formato inválido', 401));
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);

    // Set req.user with decoded data
    req.user = decoded;

    next();
  } catch (err) {
    next(createError('Token inválido o expirado', 401));
  }
};

/**
 * Middleware factory to check if user has required role(s)
 * @param {string|string[]} roles - Required role or array of roles
 * @returns {Function} Middleware function
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      // Ensure roles is an array
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      // Check if user exists (should be set by verifyToken)
      if (!req.user) {
        return next(createError('Usuario no autenticado', 401));
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return next(createError('No tiene permiso para acceder a este recurso', 403));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
