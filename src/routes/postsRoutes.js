import { Router } from 'express';
import {
  createPostController,
  getPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController,
  searchPostsController,
  filterPostsController,
} from '../controllers/postsControllers/indexPostsControllers.js';
import { verifyToken, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * POST /posts - Create a new post (protected, user or admin)
 */
router.post('/', verifyToken, requireRole(['user', 'admin']), createPostController);

/**
 * GET /posts - Get all posts with pagination (public)
 */
router.get('/', getPostsController);

/**
 * GET /posts/search - Full-text search posts (public)
 * Query params: q (required), categoria_id, ubicacion_id, fecha_desde, fecha_hasta, limit, offset
 */
router.get('/search', searchPostsController);

/**
 * GET /posts/filter - Advanced filtering of posts (public)
 * Query params: categoria_id (required), ubicacion_id (required), fecha_desde, fecha_hasta, usuario_id, search, limit, offset
 */
router.get('/filter', filterPostsController);

/**
 * GET /posts/:id - Get single post by ID (public)
 */
router.get('/:id', getPostByIdController);

/**
 * PUT /posts/:id - Update post (protected, owner or admin)
 */
router.put('/:id', verifyToken, requireRole(['user', 'admin']), updatePostController);

/**
 * DELETE /posts/:id - Soft delete post (protected, owner or admin)
 */
router.delete('/:id', verifyToken, requireRole(['user', 'admin']), deletePostController);

export default router;
