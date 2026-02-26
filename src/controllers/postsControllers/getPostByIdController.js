import { getPostById } from '../../services/postsServices/indexPostsServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle GET /posts/:id request
 * Returns a single post with full details
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getPostByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return next(createError('ID de post inválido', 400));
    }

    // Get post from service
    const post = await getPostById(parseInt(id));

    res.json({
      message: 'Post obtenido correctamente',
      post,
    });
  } catch (err) {
    // Map service error to 404 if post not found
    if (err.message.includes('no encontrado')) {
      return next(createError(err.message, 404));
    }
    next(err);
  }
};

export default getPostByIdController;
