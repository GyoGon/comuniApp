import { getCategoryById } from '../../services/categoriesServices/indexCategoriesServices.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle GET /categories/:id request (public)
 * Returns a single category
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getCategoryByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return next(createError('ID de categoría inválido', 400));
    }

    // Get category from service
    const category = await getCategoryById(parseInt(id));

    res.json({
      message: 'Categoría obtenida correctamente',
      category,
    });
  } catch (err) {
    // Map service error to 404 if not found
    if (err.message.includes('no encontrada')) {
      return next(createError(err.message, 404));
    }
    next(err);
  }
};

export default getCategoryByIdController;
