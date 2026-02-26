import { deleteCategory } from '../../services/categoriesServices/indexCategoriesServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle DELETE /categories/:id request (admin only)
 * Soft deletes a category
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const deleteCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return next(createError('ID de categoría inválido', 400));
    }

    // Delete category
    const result = await deleteCategory(parseInt(id));

    res.json({
      message: result.message,
    });
  } catch (err) {
    // Map service errors to appropriate HTTP status codes
    if (err.message.includes('no encontrada')) {
      return next(createError(err.message, 404));
    }
    next(err);
  }
};

export default deleteCategoryController;
