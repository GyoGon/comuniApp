import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

export async function deleteUser(userId) {
  logger.debug('Deleting user', { userId });

  // Verificar si el usuario existe
  const [existing] = await db.query('SELECT id FROM usuarios WHERE id = ?', [userId]);
  if (existing.length === 0) {
    logger.warn('User deletion failed - user not found', { userId });
    throw new Error('Usuario no encontrado');
  }

  // Eliminar el usuario
  await db.query('DELETE FROM usuarios WHERE id = ?', [userId]);

  logger.info('User deleted successfully', { userId });
  return { message: 'Usuario eliminado correctamente' };
}

export default deleteUser;