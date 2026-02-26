import bcrypt from 'bcrypt';
import db from '../../db/indexDb.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwtHandler.js';

/**
 * Authenticate user and generate tokens
 * @param {Object} credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Object with user data and tokens
 * @throws {Error} If email not found or password incorrect
 */
export async function loginService({ email, password }) {
  // Verify email exists
  const [users] = await db.query(
    'SELECT id, nombre, email, password_hash, role, is_active FROM usuarios WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    throw new Error('Email o contraseña incorrectos');
  }

  const user = users[0];

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw new Error('Email o contraseña incorrectos');
  }

  // Check if user is active
  if (!user.is_active) {
    throw new Error('La cuenta está desactivada');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // Update last_login and refresh_token in database
  await db.query(
    'UPDATE usuarios SET last_login = NOW(), refresh_token = ? WHERE id = ?',
    [refreshToken, user.id]
  );

  // Return user data and tokens (without password)
  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}
