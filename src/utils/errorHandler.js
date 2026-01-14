/**
 * Middleware para manejar errores y pasar al siguiente middleware
 * @param {Error} err - Error capturado
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function handleError(err, req, res, next) {
  // Loguear error (puedes mejorar aquí para logger más avanzado)
  console.error(`[Error]: ${err.message}`);

  // Respuesta genérica, puedes personalizar según tipo de error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({ error: message });
}

/**
 * Helper para crear errores con status personalizados
 * @param {string} message
 * @param {number} statusCode
 * @returns {Error}
 */
export function createError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}    

export function deleteErrorHandler(err, req, res, next) {
  if (err.name === 'NotFoundError') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }
  // Pasar al siguiente middleware si no es un error de recurso no encontrado
  next(err);
}

/**
 * Middleware para manejar errores de validación de Joi
 * @param {Error} err - Error capturado
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function joiErrorHandler(err, req, res, next) {
  if (err.isJoi) {
    // Si es un error de Joi, formatear el mensaje
    const message = err.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: message });
  }
  // Pasar al siguiente middleware si no es un error de Joi
  next(err);
}

/**
 * Middleware para manejar errores de autenticación
 * @param {Error} err - Error capturado
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function authErrorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
  // Pasar al siguiente middleware si no es un error de autenticación
  next(err);
}
/**
 * Middleware para manejar errores de autorización
 * @param {Error} err - Error capturado
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function authorizationErrorHandler(err, req, res, next) {
  if (err.name === 'ForbiddenError') {
    return res.status(403).json({ error: 'No tienes permiso para acceder a este recurso' });
  }
  // Pasar al siguiente middleware si no es un error de autorización
  next(err);
}
/**
 * Middleware para manejar errores de base de datos
 * @param {Error} err - Error capturado
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function dbErrorHandler(err, req, res, next) {
  if (err.name === 'DatabaseError') {
    return res.status(500).json({ error: 'Error en la base de datos' });
  }
  // Pasar al siguiente middleware si no es un error de base de datos
  next(err);
}

