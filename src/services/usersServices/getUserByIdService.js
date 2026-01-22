import db from '../../db/indexDb.js';

export async function getUserById(userId) {
  // Verificar si el usuario existe
  const [user] = await db.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [userId]);
  if (user.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  // Retornar el usuario sin la contraseña
  return user[0];
}
export default getUserById;