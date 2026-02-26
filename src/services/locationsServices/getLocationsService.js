import db from '../../db/indexDb.js';

/**
 * Get all locations with pagination
 * @param {Object} options
 * @param {number} options.limit - Number of locations to retrieve (default: 10)
 * @param {number} options.offset - Number of locations to skip (default: 0)
 * @returns {Promise<Object>} Object containing locations array and total count
 * @throws {Error} If database operation fails
 */
export async function getLocations({ limit = 10, offset = 0 }) {
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

    return {
      locations,
      total: countResult[0].total,
      limit,
      offset,
    };
  } catch (error) {
    throw new Error(`Error al obtener ubicaciones: ${error.message}`);
  }
}
