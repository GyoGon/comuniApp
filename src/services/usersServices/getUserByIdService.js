import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

export async function getUserById(userId) {
  logger.debug('Fetching user by ID', { userId });

  // Verificar si el usuario existe
  const [user] = await db.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [userId]);
  if (user.length === 0) {
    logger.warn('User not found', { userId });
    throw new Error('Usuario no encontrado');
  }

  // Retornar el usuario sin la contraseña
  logger.debug('User found successfully', { userId });
  return user[0];
}
export default getUserById;