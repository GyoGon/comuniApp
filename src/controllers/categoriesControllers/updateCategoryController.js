import { updateCategory } from '../../services/categoriesServices/indexCategoriesServices.js';
import { updateCategorySchema } from '../../schemas/categoriesSchemas.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle PUT /categories/:id request (admin only)
 * Updates a category
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const updateCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return next(createError('ID de categoría inválido', 400));
    }

    // Validate request body
    const { error, value } = updateCategorySchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    // Update category
    const updatedCategory = await updateCategory(parseInt(id), value);

    res.json({
      message: 'Categoría actualizada correctamente',
      category: updatedCategory,
    });
  } catch (err) {
    // Map service errors to appropriate HTTP status codes
    if (err.message.includes('no encontrada')) {
      return next(createError(err.message, 404));
    }
    if (err.message.includes('ya existe')) {
      return next(createError(err.message, 409));
    }
    if (err.message.includes('No hay campos')) {
      return next(createError(err.message, 400));
    }
    next(err);
  }
};

export default updateCategoryController;
