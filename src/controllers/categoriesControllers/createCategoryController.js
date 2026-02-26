import { createCategory } from '../../services/categoriesServices/indexCategoriesServices.js';
import { createCategorySchema } from '../../schemas/categoriesSchemas.js';
import { createError } from '../../utils/errorHandler.js';

/**
 * Handle POST /categories request (admin only)
 * Creates a new category
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const createCategoryController = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = createCategorySchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    // Create category
    const newCategory = await createCategory({
      nombre: value.nombre,
      descripcion: value.descripcion || null,
    });

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      category: newCategory,
    });
  } catch (err) {
    // Map service errors to appropriate HTTP status codes
    if (err.message.includes('ya existe')) {
      return next(createError(err.message, 409));
    }
    next(err);
  }
};

export default createCategoryController;
