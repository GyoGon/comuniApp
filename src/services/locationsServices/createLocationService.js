import db from '../../db/indexDb.js';

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
  const sql = `
    INSERT INTO ubicaciones (latitud, longitud, direccion, ciudad, provincia, pais)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [latitud, longitud, direccion, ciudad, provincia, pais]);

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
    throw new Error(`Error al crear ubicación: ${error.message}`);
  }
}
