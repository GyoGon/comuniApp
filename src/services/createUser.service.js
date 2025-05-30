import bcrypt from 'bcrypt';
import db from '../db/index.db.js'; // tu conexión

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
