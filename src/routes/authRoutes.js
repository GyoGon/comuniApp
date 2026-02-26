import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/authControllers/indexAuthController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * POST /auth/register
 * Register a new user (public)
 */
router.post('/register', registerController);

/**
 * POST /auth/login
 * Login user and return tokens (public)
 */
router.post('/login', loginController);

/**
 * POST /auth/refresh
 * Refresh access token using refresh token (public, requires refresh token in body)
 */
router.post('/refresh', refreshController);

/**
 * POST /auth/logout
 * Logout user and clear refresh token (protected - requires valid access token)
 */
router.post('/logout', verifyToken, logoutController);

export default router;
