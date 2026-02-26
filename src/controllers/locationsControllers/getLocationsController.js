import { getLocations } from '../../services/locationsServices/indexLocationsServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle GET /locations request
 * Returns paginated list of locations
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getLocationsController = async (req, res, next) => {
  try {
    // Get pagination parameters from query
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;

    // Validate pagination parameters
    if (limit < 1 || limit > 100) limit = 10;
    if (offset < 0) offset = 0;

    // Get locations from service
    const result = await getLocations({ limit, offset });

    res.json({
      message: 'Ubicaciones obtenidas correctamente',
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

export default getLocationsController;
