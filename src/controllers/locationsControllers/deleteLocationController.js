import { deleteLocation } from '../../services/locationsServices/indexLocationsServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle DELETE /locations/:id request
 * Soft deletes a location
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const deleteLocationController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return next(createError('ID de ubicación inválido', 400));
    }

    // Delete location
    const result = await deleteLocation(parseInt(id));

    res.json({
      message: result.message,
    });
  } catch (err) {
    // Map service errors to appropriate HTTP status codes
    if (err.message.includes('no encontrada')) {
      return next(createError(err.message, 404));
    }
    next(err);
  }
};

export default deleteLocationController;
