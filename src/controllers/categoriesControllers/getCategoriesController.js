import { getCategories } from '../../services/categoriesServices/indexCategoriesServices.js';

/**
 * Handle GET /categories request (public)
 * Returns all active categories
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const getCategoriesController = async (req, res, next) => {
  try {
    const categories = await getCategories();

    res.json({
      message: 'Categorías obtenidas correctamente',
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

export default getCategoriesController;
