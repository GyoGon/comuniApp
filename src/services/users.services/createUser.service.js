import bcrypt from 'bcrypt';
import db from '../db.js'; // Asegúrate de que la ruta sea correcta
export async function createUser({ nombre, email, password }) {
  const hash = await bcrypt.hash(password, 10);

  const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new Error('El usuario ya existe');
  }

  await db.query(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
    [nombre, email, hash]
  );

  return { nombre, email }; // sin password
}

export default createUser;