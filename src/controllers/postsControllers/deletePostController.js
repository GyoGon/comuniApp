import { deletePost } from '../../services/postsServices/indexPostsServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle DELETE /posts/:id request
 * Soft deletes a post (owner or admin only)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const deletePostController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return next(createError('ID de post inválido', 400));
    }

    // Delete post with authorization check
    const result = await deletePost(
      parseInt(id),
      req.user.id,
      req.user.role
    );

    res.json({
      message: result.message,
    });
  } catch (err) {
    // Map service errors to appropriate HTTP status codes
    if (err.message.includes('no encontrado')) {
      return next(createError(err.message, 404));
    }
    if (err.message.includes('No tiene permiso')) {
      return next(createError(err.message, 403));
    }
    next(err);
  }
};

export default deletePostController;
