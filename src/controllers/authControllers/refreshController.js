import { refreshService } from '../../services/authServices/indexAuthServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Refresh access token using refresh token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const refreshController = async (req, res, next) => {
  try {
    // Extract refresh token from body
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(createError('Token de refresco es requerido', 400));
    }

    // Call refreshService
    const result = await refreshService(refreshToken);

    // Return new accessToken (200)
    return res.status(200).json(result);
  } catch (err) {
    next(createError(err.message, 401));
  }
};

export default refreshController;
