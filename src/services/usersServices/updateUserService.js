import db from '../../db/indexDb.js';

export async function updateUser(userId, userData) {
  // Verificar si el usuario existe
  const [existing] = await db.query('SELECT id FROM usuarios WHERE id = ?', [userId]);
  if (existing.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  // Actualizar el usuario
  const { nombre, email, password } = userData;
  await db.query(
    'UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?',
    [nombre, email, password, userId]
  );

  return { message: 'Usuario actualizado correctamente' };
}
export default updateUser;