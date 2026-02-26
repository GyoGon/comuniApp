import { createLocation } from '../../services/locationsServices/indexLocationsServices.js';
import { createLocationSchema } from '../../schemas/locationsSchemas.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle POST /locations request
 * Creates a new location
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const createLocationController = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = createLocationSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    // Create location
    const newLocation = await createLocation(value);

    res.status(201).json({
      message: 'Ubicación creada exitosamente',
      location: newLocation,
    });
  } catch (err) {
    next(err);
  }
};

export default createLocationController;
