import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';
import { verifyRefreshToken, generateAccessToken } from '../../utils/jwtHandler.js';

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - JWT refresh token
 * @returns {Promise<Object>} New access token and user data
 * @throws {Error} If refresh token is invalid or not found in database
 */
export async function refreshService(refreshToken) {
  logger.debug('Token refresh attempt');

  // Verify refresh token is valid
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    logger.warn('Token refresh failed - invalid or expired token');
    throw new Error('Token de refresco inválido o expirado');
  }

  const userId = decoded.userId;

  // Check if refresh token exists in database and matches
  const [users] = await db.query(
    'SELECT id, role, refresh_token FROM usuarios WHERE id = ? AND refresh_token = ?',
    [userId, refreshToken]
  );

  if (users.length === 0) {
    logger.warn('Token refresh failed - token not found in database', { userId });
    throw new Error('Token de refresco no encontrado o no válido');
  }

  const user = users[0];

  // Generate new access token
  const newAccessToken = generateAccessToken(user.id, user.role);

  logger.info('Token refreshed successfully', { userId });
  return {
    accessToken: newAccessToken,
  };
}
