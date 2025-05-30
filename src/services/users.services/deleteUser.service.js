import db from '../db/index.db.js';

export async function deleteUser(userId) {
  // Verificar si el usuario existe
  const [existing] = await db.query('SELECT id FROM usuarios WHERE id = ?', [userId]);
  if (existing.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  // Eliminar el usuario
  await db.query('DELETE FROM usuarios WHERE id = ?', [userId]);

  return { message: 'Usuario eliminado correctamente' };
}

export default deleteUser;