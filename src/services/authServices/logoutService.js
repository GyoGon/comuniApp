import db from '../../db/indexDb.js';

/**
 * Logout user by clearing refresh token from database
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 * @throws {Error} If database operation fails
 */
export async function logoutService(userId) {
  // Clear refresh token
  await db.query(
    'UPDATE usuarios SET refresh_token = NULL WHERE id = ?',
    [userId]
  );
}
