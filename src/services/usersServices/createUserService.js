import bcrypt from 'bcrypt';
import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

export async function createUser({ nombre, email, password }) {
  logger.debug('Creating new user', { email });

  const hash = await bcrypt.hash(password, 10);

  const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
  if (existing.length > 0) {
    logger.warn('User creation failed - user already exists', { email });
    throw new Error('El usuario ya existe');
  }

  await db.query(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
    [nombre, email, hash]
  );

  logger.info('User created successfully', { email, nombre });
  return { nombre, email }; // sin password
}

export default createUser;