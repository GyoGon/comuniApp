import { createPost } from '../../services/postsServices/indexPostsServices.js';
import { createPostSchema } from '../../schemas/postsSchemas.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle POST /posts request
 * Creates a new post
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const createPostController = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = createPostSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    // Extract usuario_id from verified token
    const usuarioId = req.user.id;

    // Create post with usuario_id from token
    const newPost = await createPost({
      usuario_id: usuarioId,
      titulo: value.titulo,
      descripcion: value.descripcion,
      categoria_id: value.categoria_id,
      ubicacion_id: value.ubicacion_id,
    });

    res.status(201).json({
      message: 'Post creado exitosamente',
      post: newPost,
    });
  } catch (err) {
    next(err);
  }
};

export default createPostController;
