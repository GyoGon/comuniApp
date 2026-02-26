import { nearbyLocations } from '../../services/locationsServices/indexLocationsServices.js';
import { distanceSearchSchema } from '../../schemas/searchSchemas.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle GET /locations/nearby request
 * Find locations within a specified radius from given coordinates
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const nearbyLocationsController = async (req, res, next) => {
  try {
    // Validate query parameters
    const { error, value } = distanceSearchSchema.validate(req.query);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { latitud, longitud, radiusKm, limit, offset } = value;

    // Call nearbyLocations service
    const result = await nearbyLocations(latitud, longitud, radiusKm, { limit, offset });

    res.json({
      message: 'Ubicaciones cercanas obtenidas correctamente',
      data: result.locations,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default nearbyLocationsController;
