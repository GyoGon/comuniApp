import { Router } from 'express';

import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users/index.users.controller.js';
import { validateUser } from '../middlewares/validateUser.js';
import { validateUserId } from '../middlewares/validateUserId.js';
const router = Router();

// Rutas de usuarios
router.get('/', getUsers); // Obtener todos los usuarios
router.get('/:id', validateUserId, getUserById); // Obtener usuario por ID
router.post('/', validateUser, createUser); // Crear nuevo usuario
router.put('/:id', validateUserId, validateUser, updateUser); // Actualizar usuario por ID
router.delete('/:id', validateUserId, deleteUser); // Eliminar usuario por ID

export default router;