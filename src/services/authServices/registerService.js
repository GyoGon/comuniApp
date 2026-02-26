import bcrypt from 'bcrypt';
import db from '../../db/indexDb.js';

/**
 * Register a new user
 * @param {Object} userData
 * @param {string} userData.nombre - User full name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password (will be hashed)
 * @param {string} [userData.telefono] - Optional phone number
 * @returns {Promise<Object>} Created user object (without password)
 * @throws {Error} If email already exists or database error
 */
export async function registerService({ nombre, email, password, telefono }) {
  // Check if email already exists
  const [existing] = await db.query(
    'SELECT id FROM usuarios WHERE email = ?',
    [email]
  );

  if (existing.length > 0) {
    throw new Error('El email ya está registrado');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, email, password_hash, telefono, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, email, hashedPassword, telefono || null, 'user', true]
  );

  // Return user data without password
  const [newUser] = await db.query(
    'SELECT id, nombre, email, telefono, role, is_active, fecha_registro FROM usuarios WHERE id = ?',
    [result.insertId]
  );

  return newUser[0];
}
