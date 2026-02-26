import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Get a single location by ID
 * @param {number} locationId - ID of the location
 * @returns {Promise<Object>} Location object
 * @throws {Error} If location not found or database operation fails
 */
export async function getLocationById(locationId) {
  logger.debug('Fetching location by ID', { locationId });

  const sql = `
    SELECT id, latitud, longitud, direccion, ciudad, provincia, pais
    FROM ubicaciones
    WHERE id = ? AND deleted_at IS NULL
  `;

  try {
    const [locations] = await db.query(sql, [locationId]);

    if (locations.length === 0) {
      logger.warn('Location not found', { locationId });
      throw new Error('Ubicación no encontrada');
    }

    logger.debug('Location found successfully', { locationId });
    return locations[0];
  } catch (error) {
    logger.error('Error fetching location', { locationId, error: error.message });
    throw new Error(`Error al obtener ubicación: ${error.message}`);
  }
}
