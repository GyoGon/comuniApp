import { updatePost } from '../../services/postsServices/indexPostsServices.js';
import { updatePostSchema } from '../../schemas/postsSchemas.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle PUT /posts/:id request
 * Updates a post (owner or admin only)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const updatePostController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return next(createError('ID de post inválido', 400));
    }

    // Validate request body
    const { error, value } = updatePostSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    // Update post with authorization check
    const updatedPost = await updatePost(
      parseInt(id),
      req.user.id,
      req.user.role,
      value
    );

    res.json({
      message: 'Post actualizado correctamente',
      post: updatedPost,
    });
  } catch (err) {
    // Map service errors to appropriate HTTP status codes
    if (err.message.includes('no encontrado')) {
      return next(createError(err.message, 404));
    }
    if (err.message.includes('No tiene permiso')) {
      return next(createError(err.message, 403));
    }
    if (err.message.includes('No hay campos')) {
      return next(createError(err.message, 400));
    }
    next(err);
  }
};

export default updatePostController;
