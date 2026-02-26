import { createError } from '../utils/errorHandler.js';

/**
 * Authorization middleware wrapper to check user has required role
 * @param {string|string[]} requiredRole - Required role or array of roles
 * @returns {Function} Middleware function
 */
export const authorize = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Ensure requiredRole is an array
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

      // Check if user exists in req.user (should be set by verifyToken middleware)
      if (!req.user) {
        throw createError('Usuario no autenticado', 401);
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        throw createError('No tiene permiso para acceder a este recurso', 403);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default authorize;
