import db from '../../db/indexDb.js';

/**
 * Calculate distance between two coordinates using Haversine formula (in km)
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find locations within a specified radius from given coordinates
 * @param {number} latitud - User latitude
 * @param {number} longitud - User longitude
 * @param {number} radiusKm - Search radius in kilometers (default: 10)
 * @param {Object} pagination - Pagination options
 * @param {number} pagination.limit - Number of results (default: 20)
 * @param {number} pagination.offset - Number of results to skip (default: 0)
 * @returns {Promise<Object>} Object with locations array (with distance_km), total count
 * @throws {Error} If database operation fails or invalid coordinates
 */
export async function nearbyLocations(latitud, longitud, radiusKm = 10, pagination = {}) {
  const { limit = 20, offset = 0 } = pagination;

  try {
    // Validate coordinates
    if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
      throw new Error('Coordenadas inválidas (latitud: -90 a 90, longitud: -180 a 180)');
    }

    if (radiusKm <= 0) {
      throw new Error('El radio debe ser mayor a 0 km');
    }

    // Get all locations from database
    const sql = `
      SELECT 
        id,
        nombre,
        latitud,
        longitud,
        direccion,
        ciudad,
        descripcion,
        fecha_creacion
      FROM ubicaciones
      ORDER BY fecha_creacion DESC
    `;

    const [locations] = await db.query(sql);

    // Calculate distance for each location and filter
    const locationsWithDistance = locations
      .map((location) => ({
        ...location,
        distance_km: parseFloat(
          haversineDistance(latitud, longitud, location.latitud, location.longitud).toFixed(2)
        ),
      }))
      .filter((location) => location.distance_km <= radiusKm)
      .sort((a, b) => a.distance_km - b.distance_km);

    // Apply pagination to filtered results
    const total = locationsWithDistance.length;
    const paginatedLocations = locationsWithDistance.slice(offset, offset + limit);

    return {
      locations: paginatedLocations,
      total,
      limit,
      offset,
    };
  } catch (error) {
    throw new Error(`Error en búsqueda de ubicaciones cercanas: ${error.message}`);
  }
}
