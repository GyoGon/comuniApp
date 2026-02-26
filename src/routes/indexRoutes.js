import { Router } from 'express';
import userRoutes from './usersRoutes.js';
import healthRoutes from './healthRoutes.js';
//import postRoutes from './postsRoutes.js'; // luego lo creás

const router = Router();

// Health check route
router.use('/', healthRoutes);

// Redirecciones a subrutas
router.use('/users', userRoutes);
//router.use('/posts', postRoutes);

router.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API activa. Subrutas: /users, /health',
    health: 'GET /api/health'
  });
});

export default router;
