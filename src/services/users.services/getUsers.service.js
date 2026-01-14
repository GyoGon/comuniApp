import db from '../../db/index.db.js';

export async function getUsers() {
  // Obtener todos los usuarios
  const [users] = await db.query('SELECT id, nombre, email FROM usuarios');
  
  // Retornar los usuarios sin las contraseñas
  return users;
}
export default getUsers;