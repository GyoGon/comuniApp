import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

export async function getUsers() {
  logger.debug('Fetching all users');

  // Obtener todos los usuarios
  const [users] = await db.query('SELECT id, nombre, email FROM usuarios');
  
  logger.info('Users fetched successfully', { count: users.length });
  // Retornar los usuarios sin las contraseñas
  return users;
}
export default getUsers;