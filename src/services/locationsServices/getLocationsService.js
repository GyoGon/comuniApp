import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Get all locations with pagination
 * @param {Object} options
 * @param {number} options.limit - Number of locations to retrieve (default: 10)
 * @param {number} options.offset - Number of locations to skip (default: 0)
 * @returns {Promise<Object>} Object containing locations array and total count
 * @throws {Error} If database operation fails
 */
export async function getLocations({ limit = 10, offset = 0 }) {
  logger.debug('Fetching locations', { limit, offset });

  const sql = `
    SELECT id, latitud, longitud, direccion, ciudad, provincia, pais
    FROM ubicaciones
    WHERE deleted_at IS NULL
    ORDER BY ciudad ASC
    LIMIT ? OFFSET ?
  `;

  const countSql = 'SELECT COUNT(*) as total FROM ubicaciones WHERE deleted_at IS NULL';

  try {
    const [locations] = await db.query(sql, [limit, offset]);
    const [countResult] = await db.query(countSql);

    logger.info('Locations fetched successfully', { count: locations.length, total: countResult[0].total });
    return {
      locations,
      total: countResult[0].total,
      limit,
      offset,
    };
  } catch (error) {
    logger.error('Error fetching locations', { error: error.message });
    throw new Error(`Error al obtener ubicaciones: ${error.message}`);
  }
}
