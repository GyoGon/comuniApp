import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

export async function updateUser(userId, userData) {
  logger.debug('Updating user', { userId, fields: Object.keys(userData) });

  // Verificar si el usuario existe
  const [existing] = await db.query('SELECT id FROM usuarios WHERE id = ?', [userId]);
  if (existing.length === 0) {
    logger.warn('User update failed - user not found', { userId });
    throw new Error('Usuario no encontrado');
  }

  // Actualizar el usuario
  const { nombre, email, password } = userData;
  await db.query(
    'UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?',
    [nombre, email, password, userId]
  );

  logger.info('User updated successfully', { userId });
  return { message: 'Usuario actualizado correctamente' };
}
export default updateUser;