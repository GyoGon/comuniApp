import { Router } from 'express';
import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/categoriesControllers/indexCategoriesControllers.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * POST /categories - Create a new category (admin only)
 */
router.post('/', verifyToken, requireRole('admin'), createCategoryController);

/**
 * GET /categories - Get all active categories (public)
 */
router.get('/', getCategoriesController);

/**
 * GET /categories/:id - Get single category by ID (public)
 */
router.get('/:id', getCategoryByIdController);

/**
 * PUT /categories/:id - Update category (admin only)
 */
router.put('/:id', verifyToken, requireRole('admin'), updateCategoryController);

/**
 * DELETE /categories/:id - Soft delete category (admin only)
 */
router.delete('/:id', verifyToken, requireRole('admin'), deleteCategoryController);

export default router;
