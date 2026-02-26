import { searchPosts } from '../../services/postsServices/indexPostsServices.js';
import { filterPosts } from '../../services/postsServices/indexPostsServices.js';
import { searchSchema, filterSchema } from '../../schemas/searchSchemas.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle GET /posts/search request
 * Search and filter posts with advanced parameters
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const searchPostsController = async (req, res, next) => {
  try {
    // Validate query parameters
    const { error, value } = searchSchema.validate(req.query);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { q, categoria_id, ubicacion_id, fecha_desde, fecha_hasta, limit, offset } = value;

    // Build filters object
    const filters = {};
    if (categoria_id) filters.categoria_id = categoria_id;
    if (ubicacion_id) filters.ubicacion_id = ubicacion_id;
    if (fecha_desde) filters.fecha_desde = fecha_desde;
    if (fecha_hasta) filters.fecha_hasta = fecha_hasta;

    // Call search service
    const result = await searchPosts(q, filters, { limit, offset });

    res.json({
      message: 'Búsqueda de posts realizada correctamente',
      data: result.posts,
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

/**
 * Handle GET /posts/filter request
 * Filter posts by categoria_id and ubicacion_id (required) with optional criteria
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const filterPostsController = async (req, res, next) => {
  try {
    // Validate query parameters
    const { error, value } = filterSchema.validate(req.query);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { categoria_id, ubicacion_id, fecha_desde, fecha_hasta, usuario_id, search, limit, offset } = value;

    // Build filters object
    const filters = {
      categoria_id,
      ubicacion_id,
    };
    if (fecha_desde) filters.fecha_desde = fecha_desde;
    if (fecha_hasta) filters.fecha_hasta = fecha_hasta;
    if (usuario_id) filters.usuario_id = usuario_id;
    if (search) filters.search = search;

    // Call filter service
    const result = await filterPosts(filters, { limit, offset });

    res.json({
      message: 'Filtrado de posts realizado correctamente',
      data: result.posts,
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

export default searchPostsController;
