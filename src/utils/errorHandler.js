/**
 * Middleware para manejar errores y pasar al siguiente middleware
 * @param {Error} err - Error capturado
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function errorHandler(err, req, res, next) {
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
