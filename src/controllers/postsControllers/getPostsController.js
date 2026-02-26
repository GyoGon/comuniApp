import { getPosts } from '../../services/postsServices/indexPostsServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle GET /posts request
 * Returns paginated list of posts
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getPostsController = async (req, res, next) => {
  try {
    // Get pagination parameters from query
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;

    // Validate pagination parameters
    if (limit < 1 || limit > 100) limit = 10;
    if (offset < 0) offset = 0;

    // Get posts from service
    const result = await getPosts({ limit, offset });

    res.json({
      message: 'Posts obtenidos correctamente',
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

export default getPostsController;
