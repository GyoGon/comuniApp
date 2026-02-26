import { Router } from 'express';
import userRoutes from './usersRoutes.js';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import postsRoutes from './postsRoutes.js';
import categoriesRoutes from './categoriesRoutes.js';
import locationsRoutes from './locationsRoutes.js';

const router = Router();

// Health check route
router.use('/', healthRoutes);

// Redirecciones a subrutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/locations', locationsRoutes);

router.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API activa. Subrutas: /users, /posts, /categories, /locations, /auth, /health',
    health: 'GET /api/health',
    endpoints: {
      auth: 'POST /api/auth/register, POST /api/auth/login',
      users: 'GET/POST /api/users, GET/PUT/DELETE /api/users/:id',
      posts: 'GET/POST /api/posts, GET/PUT/DELETE /api/posts/:id',
      categories: 'GET/POST /api/categories, GET/PUT/DELETE /api/categories/:id',
      locations: 'GET/POST /api/locations, GET/PUT/DELETE /api/locations/:id'
    }
  });
});

export default router;
