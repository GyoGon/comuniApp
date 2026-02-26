import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Logout user by clearing refresh token from database
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 * @throws {Error} If database operation fails
 */
export async function logoutService(userId) {
  logger.debug('User logout', { userId });

  // Clear refresh token
  await db.query(
    'UPDATE usuarios SET refresh_token = NULL WHERE id = ?',
    [userId]
  );

  logger.info('User logged out successfully', { userId });
}
