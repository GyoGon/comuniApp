import { Router } from 'express';
import userRoutes from './users.routes.js';
import postRoutes from './posts.routes.js'; // luego lo creás

const router = Router();

// Redirecciones a subrutas
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

router.get('/', (req, res) => {
  res.json({ mensaje: 'API activa. Subrutas: /users, /posts' });
});

export default router;