import { logoutService } from '../../services/authServices/indexAuthServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Logout user by clearing refresh token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const logoutController = async (req, res, next) => {
  try {
    // Extract userId from req.user (set by verifyToken middleware)
    const userId = req.user?.userId;

    if (!userId) {
      return next(createError('Usuario no autenticado', 401));
    }

    // Call logoutService
    await logoutService(userId);

    // Return success message (200)
    return res.status(200).json({
      message: 'Sesión cerrada exitosamente',
    });
  } catch (err) {
    next(err);
  }
};

export default logoutController;
