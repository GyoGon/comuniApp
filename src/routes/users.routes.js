import { Router } from 'express';

import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controllers/index.users.controller.js';
//import { validateUser } from '../middlewares/validateUser.js';
//import { validateUserId } from '../middlewares/validateUserId.js';
const router = Router();

// Rutas de usuarios
router.get('/', getUsers); // Obtener todos los usuarios
router.get('/:id', getUserById); // Obtener usuario por ID
router.post('/', createUser); // Crear nuevo usuario
router.put('/:id', updateUser); // Actualizar usuario por ID
router.delete('/:id', deleteUser); // Eliminar usuario por ID

export default router;