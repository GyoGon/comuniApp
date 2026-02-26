import db from '../../db/indexDb.js';
import logger from '../../utils/logger.js';

/**
 * Create a new location
 * @param {Object} locationData
 * @param {number} locationData.latitud - Latitude coordinate
 * @param {number} locationData.longitud - Longitude coordinate
 * @param {string} [locationData.direccion] - Street address
 * @param {string} [locationData.ciudad] - City name
 * @param {string} [locationData.provincia] - Province/State name
 * @param {string} [locationData.pais] - Country name
 * @returns {Promise<Object>} Created location object
 * @throws {Error} If database operation fails
 */
export async function createLocation({
  latitud,
  longitud,
  direccion = null,
  ciudad = null,
  provincia = null,
  pais = null,
}) {
  logger.debug('Creating new location', { latitud, longitud, ciudad });

  const sql = `
    INSERT INTO ubicaciones (latitud, longitud, direccion, ciudad, provincia, pais)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [latitud, longitud, direccion, ciudad, provincia, pais]);

    logger.info('Location created successfully', { locationId: result.insertId, ciudad });
    return {
      id: result.insertId,
      latitud,
      longitud,
      direccion,
      ciudad,
      provincia,
      pais,
    };
  } catch (error) {
    logger.error('Error creating location', { ciudad, error: error.message });
    throw new Error(`Error al crear ubicación: ${error.message}`);
  }
}
