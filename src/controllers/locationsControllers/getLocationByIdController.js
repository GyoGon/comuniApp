import { getLocationById } from '../../services/locationsServices/indexLocationsServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle GET /locations/:id request
 * Returns a single location
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getLocationByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return next(createError('ID de ubicación inválido', 400));
    }

    // Get location from service
    const location = await getLocationById(parseInt(id));

    res.json({
      message: 'Ubicación obtenida correctamente',
      location,
    });
  } catch (err) {
    // Map service error to 404 if not found
    if (err.message.includes('no encontrada')) {
      return next(createError(err.message, 404));
    }
    next(err);
  }
};

export default getLocationByIdController;
