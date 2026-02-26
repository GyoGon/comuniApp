import { updateLocation } from '../../services/locationsServices/indexLocationsServices.js';
import { updateLocationSchema } from '../../schemas/locationsSchemas.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle PUT /locations/:id request
 * Updates a location
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const updateLocationController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return next(createError('ID de ubicación inválido', 400));
    }

    // Validate request body
    const { error, value } = updateLocationSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    // Update location
    const updatedLocation = await updateLocation(parseInt(id), value);

    res.json({
      message: 'Ubicación actualizada correctamente',
      location: updatedLocation,
    });
  } catch (err) {
    // Map service errors to appropriate HTTP status codes
    if (err.message.includes('no encontrada')) {
      return next(createError(err.message, 404));
    }
    if (err.message.includes('No hay campos')) {
      return next(createError(err.message, 400));
    }
    next(err);
  }
};

export default updateLocationController;
