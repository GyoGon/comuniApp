import { Router } from 'express';
import userRoutes from './usersRoutes.js';
//import postRoutes from './postsRoutes.js'; // luego lo creás

const router = Router();

// Redirecciones a subrutas
router.use('/users', userRoutes);
//router.use('/posts', postRoutes);

router.get('/', (req, res) => {
  res.json({ mensaje: 'API activa. Subrutas: /users' });
});

export default router;