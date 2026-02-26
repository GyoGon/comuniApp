import jwt from 'jsonwebtoken';

/**
 * Generate an access token (short-lived)
 * @param {number} userId - User ID
 * @param {string} role - User role (user, admin, moderator)
 * @returns {string} JWT access token
 */
export function generateAccessToken(userId, role) {
  const payload = { userId, role };
  const secret = process.env.JWT_SECRET_ACCESS || 'access_secret_key';
  const expiresIn = process.env.JWT_ACCESS_EXPIRE || '15m';

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Generate a refresh token (long-lived)
 * @param {number} userId - User ID
 * @returns {string} JWT refresh token
 */
export function generateRefreshToken(userId) {
  const payload = { userId };
  const secret = process.env.JWT_SECRET_REFRESH || 'refresh_secret_key';
  const expiresIn = process.env.JWT_REFRESH_EXPIRE || '7d';

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify and decode an access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyAccessToken(token) {
  const secret = process.env.JWT_SECRET_ACCESS || 'access_secret_key';

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error(`Access token verification failed: ${err.message}`);
  }
}

/**
 * Verify and decode a refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export function verifyRefreshToken(token) {
  const secret = process.env.JWT_SECRET_REFRESH || 'refresh_secret_key';

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error(`Refresh token verification failed: ${err.message}`);
  }
}
